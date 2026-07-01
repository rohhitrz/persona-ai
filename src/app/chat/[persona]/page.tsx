import type { Metadata } from "next";
import Link from "next/link";

import ChatRoom from "@/components/ChatRoom";
import { getPersona } from "@/lib/personas";

type ChatPageProps = {
  params: Promise<{ persona: string }>;
};

// Pre-render the two known personas; unknown ids still render on demand and
// fall through to the "not found" state below.
export function generateStaticParams() {
  return [{ persona: "hitesh" }, { persona: "piyush" }];
}

export async function generateMetadata({
  params,
}: ChatPageProps): Promise<Metadata> {
  const { persona: personaId } = await params;
  const persona = getPersona(personaId);

  return {
    title: persona
      ? `Chat with ${persona.displayName} — Persona AI`
      : "Persona not found — Persona AI",
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { persona: personaId } = await params;
  const persona = getPersona(personaId);

  if (!persona) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-stone-400">
          404
        </p>
        <h1 className="mt-3 text-2xl font-bold text-stone-900">
          Persona not found
        </h1>
        <p className="mt-2 max-w-sm text-stone-500">
          We couldn&apos;t find a mentor called &ldquo;{personaId}&rdquo;. Pick
          one from the home page to start chatting.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700"
        >
          <span aria-hidden>←</span> Back to home
        </Link>
      </main>
    );
  }

  // key={persona.id} forces a fresh ChatRoom (and fresh message state) when
  // switching personas, so one persona's conversation never leaks into another.
  return <ChatRoom key={persona.id} persona={persona} />;
}
