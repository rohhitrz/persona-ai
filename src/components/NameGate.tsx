"use client";

import { useState } from "react";

import { useUserName } from "@/hooks/useUserName";

/**
 * First-visit name capture. Shown as a modal over the landing page when no
 * name is stored yet; a returning visitor just sees a small "Hi, {name} ·
 * change" pill they can use to update it. Never hard-blocks anything — chat
 * lives on other routes and works without a name.
 */
export default function NameGate() {
  const { name, save, loaded } = useUserName();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");

  const showModal = loaded && (!name || editing);

  function openEditor() {
    setValue(name ?? "");
    setEditing(true);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!value.trim()) return;
    save(value);
    setEditing(false);
  }

  return (
    <>
      {loaded && name && !editing && (
        <div className="fixed right-4 top-4 z-40">
          <div className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/80 px-3 py-1.5 text-xs text-stone-500 shadow-sm backdrop-blur">
            <span className="max-w-[8rem] truncate">
              Hi, <span className="font-medium text-stone-700">{name}</span>
            </span>
            <span aria-hidden>·</span>
            <button
              type="button"
              onClick={openEditor}
              className="font-medium text-stone-500 underline underline-offset-2 hover:text-stone-800"
            >
              change
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/20 px-6 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-xl sm:p-8"
          >
            <h2 className="text-lg font-semibold text-stone-900">
              What should Hitesh Sir and Piyush Sir call you?
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Just a first name is perfect — it keeps the chat a little more
              personal.
            </p>
            <input
              autoFocus
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Your name"
              maxLength={40}
              className="mt-5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
            />
            <div className="mt-4 flex items-center justify-center gap-3">
              {editing && (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-stone-500 transition-colors hover:text-stone-800"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!value.trim()}
                className="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Let&apos;s go
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
