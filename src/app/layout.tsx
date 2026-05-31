import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calorrific",
  description: "Accurate tracking in seconds, not minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex justify-center" style={{ fontFamily: '"Avenir Next", "Avenir", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <div className="w-full max-w-[428px] min-h-dvh bg-bg-primary relative shadow-[0_0_60px_rgba(0,0,0,0.08)]">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
