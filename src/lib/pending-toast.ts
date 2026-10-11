// Carries a toast across a navigation: the page that saves calls queueToast()
// right before routing away, and the destination shows it on mount. Without
// this, a toast shown just before router.push() unmounts with the page.
const KEY = 'hm_pending_toast';

export function queueToast(message: string) {
  try { sessionStorage.setItem(KEY, message); } catch {}
}

export function takeQueuedToast(): string | null {
  try {
    const message = sessionStorage.getItem(KEY);
    if (message) sessionStorage.removeItem(KEY);
    return message;
  } catch {
    return null;
  }
}

export const GOALS_UPDATED_TOAST = 'Goals updated from this week onwards';
