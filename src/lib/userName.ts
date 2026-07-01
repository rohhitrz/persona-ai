// Client-side storage for the user's display name. No backend — just
// localStorage, read gracefully so a blocked store (private mode, etc.) never
// throws or breaks the app.

export const USER_NAME_KEY = "persona-ai.userName";

export function getStoredUserName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(USER_NAME_KEY);
    return value && value.trim() ? value : null;
  } catch {
    return null;
  }
}

export function setStoredUserName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USER_NAME_KEY, name);
  } catch {
    // Storage unavailable — fail silently; the name just won't persist.
  }
}
