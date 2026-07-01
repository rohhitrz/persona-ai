"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { ChatMessage, PersonaConfig, UiMessage } from "@/types";
import Avatar from "./Avatar";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const ERROR_MESSAGE =
  "Something went wrong reaching the model. Please try again in a bit.";

export default function ChatRoom({ persona }: { persona: PersonaConfig }) {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the latest message (or typing indicator) in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  async function fetchReply(history: ChatMessage[]): Promise<UiMessage> {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personaId: persona.id, messages: history }),
      });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data = (await res.json()) as { reply?: string };
      if (!data.reply) throw new Error("Empty reply from server");

      return { role: "assistant", content: data.reply };
    } catch (error) {
      console.error("[chat] failed to fetch reply:", error);
      return { role: "error", content: ERROR_MESSAGE };
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || isTyping) return;

    const nextMessages: UiMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsTyping(true);

    // Only real chat messages (user/assistant) go to the model — drop any
    // in-thread error notices.
    const history = nextMessages.filter(
      (m): m is ChatMessage => m.role !== "error",
    );

    const reply = await fetchReply(history);

    setMessages((prev) => [...prev, reply]);
    setIsTyping(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  const isEmpty = messages.length === 0 && !isTyping;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <header className="shrink-0 border-b border-stone-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            aria-label="Back to home"
            className="flex h-9 items-center gap-1 rounded-full px-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-100"
          >
            <span aria-hidden>←</span>
            <span className="hidden sm:inline">Back</span>
          </Link>
          <Avatar
            src={persona.avatarSrc}
            alt={persona.displayName}
            initials={persona.initials}
            accent={persona.accent}
            size={40}
          />
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-stone-900">
              {persona.displayName}
            </h1>
            <p className="truncate text-xs text-stone-500">{persona.tagline}</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-4 px-4 py-6">
          {isEmpty ? (
            <div className="m-auto flex flex-col items-center gap-4 py-10 text-center">
              <Avatar
                src={persona.avatarSrc}
                alt={persona.displayName}
                initials={persona.initials}
                accent={persona.accent}
                size={72}
              />
              <div>
                <p className="text-base font-semibold text-stone-800">
                  Say hi to {persona.displayName} 👋
                </p>
                <p className="mx-auto mt-1 max-w-xs text-sm text-stone-500">
                  {persona.tagline}
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble
                key={index}
                message={message}
                persona={persona}
              />
            ))
          )}
          {isTyping && <TypingIndicator persona={persona} />}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-stone-200 bg-white/80 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl px-4 py-3">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="flex items-end gap-2"
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={`Message ${persona.displayName}…`}
              className="max-h-40 min-h-[44px] flex-1 resize-none rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex h-11 shrink-0 items-center rounded-2xl px-5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: persona.accent }}
            >
              Send
            </button>
          </form>
          <p className="mt-1.5 px-1 text-[11px] text-stone-400">
            Enter to send · Shift + Enter for a new line
          </p>
        </div>
      </div>
    </div>
  );
}
