"use client";

import { useCallback, useSyncExternalStore } from "react";

import { getStoredUserName, setStoredUserName } from "@/lib/userName";

const NAME_EVENT = "persona-ai:name-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(NAME_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(NAME_EVENT, callback);
  };
}

/**
 * Read/write the stored user name via useSyncExternalStore, so the value stays
 * in sync across tabs and same-tab edits without setState-in-effect. On the
 * server (and until hydration) the snapshot is `undefined`; `loaded` flips true
 * once the client value is known, letting callers avoid a first-visit flash.
 */
export function useUserName() {
  const stored = useSyncExternalStore<string | null | undefined>(
    subscribe,
    getStoredUserName,
    () => undefined,
  );

  const save = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setStoredUserName(trimmed);
    window.dispatchEvent(new Event(NAME_EVENT));
  }, []);

  return { name: stored ?? null, save, loaded: stored !== undefined };
}
