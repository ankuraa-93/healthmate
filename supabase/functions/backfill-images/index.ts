import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BATCH_SIZE = 15;
const RETRY_INTERVAL_DAYS = 30;
const HEAD_TIMEOUT_MS = 4000;
const GLOBAL_DEADLINE_MS = 120000;

Deno.serve(async (req) => {
  const startTime = Date.now();

  // Auth check: require service role key or matching authorization
  const authHeader = req.headers.get("Authorization");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (authHeader !== `Bearer ${serviceRoleKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const googleApiKey = Deno.env.get("GOOGLE_CUSTOM_SEARCH_API_KEY");
  const googleCx = Deno.env.get("GOOGLE_CUSTOM_SEARCH_CX");

  if (!googleApiKey || !googleCx) {
    return new Response(
      JSON.stringify({ error: "Missing GOOGLE_CUSTOM_SEARCH_API_KEY or GOOGLE_CUSTOM_SEARCH_CX" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Fetch items needing images
  const retryDate = new Date();
  retryDate.setDate(retryDate.getDate() - RETRY_INTERVAL_DAYS);

  const { data: items, error: fetchError } = await supabase
    .from("food_library")
    .select("id, name")
    .is("image_url", null)
    .or(`image_search_failed_at.is.null,image_search_failed_at.lt.${retryDate.toISOString()}`)
    .order("created_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (fetchError) {
    return new Response(
      JSON.stringify({ error: "DB query failed", details: fetchError.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!items || items.length === 0) {
    return new Response(
      JSON.stringify({ message: "No items need images", processed: 0 }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const results: { name: string; status: string; image_url?: string }[] = [];

  for (const item of items) {
    // Check global deadline
    if (Date.now() - startTime > GLOBAL_DEADLINE_MS) {
      results.push({ name: item.name, status: "skipped_timeout" });
      continue;
    }

    try {
      const imageUrl = await searchImage(item.name, googleApiKey, googleCx);

      if (imageUrl) {
        await supabase
          .from("food_library")
          .update({ image_url: imageUrl, image_search_failed_at: null })
          .eq("id", item.id);
        results.push({ name: item.name, status: "found", image_url: imageUrl });
      } else {
        await supabase
          .from("food_library")
          .update({ image_search_failed_at: new Date().toISOString() })
          .eq("id", item.id);
        results.push({ name: item.name, status: "not_found" });
      }
    } catch (err) {
      // Google API quota exhausted
      if (err instanceof Error && err.message === "quota_exhausted") {
        results.push({ name: item.name, status: "quota_exhausted" });
        break;
      }
      results.push({ name: item.name, status: "error" });
    }
  }

  return new Response(
    JSON.stringify({
      processed: results.length,
      found: results.filter((r) => r.status === "found").length,
      failed: results.filter((r) => r.status === "not_found").length,
      results,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});

async function searchImage(
  foodName: string,
  apiKey: string,
  cx: string
): Promise<string | null> {
  const query = `"${foodName}" food photo`;
  const excludeSites = "-site:pinterest.com -site:shutterstock.com -site:gettyimages.com -site:istockphoto.com -site:dreamstime.com -site:alamy.com";

  const params = new URLSearchParams({
    q: `${query} ${excludeSites}`,
    cx,
    key: apiKey,
    searchType: "image",
    imgType: "photo",
    imgSize: "medium",
    safe: "active",
    num: "5",
  });

  const resp = await fetch(
    `https://www.googleapis.com/customsearch/v1?${params}`
  );

  if (resp.status === 429) {
    throw new Error("quota_exhausted");
  }

  if (!resp.ok) {
    console.error(`Google API error for "${foodName}": ${resp.status}`);
    return null;
  }

  const data = await resp.json();
  const imageItems = data.items ?? [];

  // Try each result until one validates
  for (const result of imageItems) {
    const url: string = result.link;
    if (await validateImageUrl(url)) {
      return url;
    }
  }

  return null;
}

async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), HEAD_TIMEOUT_MS);

    const resp = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (resp.status !== 200) return false;

    const contentType = resp.headers.get("content-type") ?? "";
    return contentType.startsWith("image/");
  } catch {
    return false;
  }
}
