import OpenAI from "openai";
import { NextResponse } from "next/server";

import { CHAT_MODEL, getOpenAIClient } from "@/lib/openai";
import { getPersona } from "@/lib/personas";
import { HITESH_SYSTEM_PROMPT } from "@/lib/prompts/hitesh";
import { PIYUSH_SYSTEM_PROMPT } from "@/lib/prompts/piyush";
import type { PersonaId } from "@/types";

// System prompt for each persona. Both personas are live and go through the
// exact same path from here.
const SYSTEM_PROMPTS: Record<PersonaId, string> = {
  hitesh: HITESH_SYSTEM_PROMPT,
  piyush: PIYUSH_SYSTEM_PROMPT,
};

type IncomingMessage = { role: "user" | "assistant"; content: string };

function isValidMessage(value: unknown): value is IncomingMessage {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  return (
    (m.role === "user" || m.role === "assistant") &&
    typeof m.content === "string"
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { personaId, messages, userName } = (body ?? {}) as {
    personaId?: string;
    messages?: unknown;
    userName?: string;
  };

  // Validate the persona.
  const persona = personaId ? getPersona(personaId) : undefined;
  if (!persona) {
    return NextResponse.json({ error: "Unknown persona." }, { status: 400 });
  }

  const systemPrompt = SYSTEM_PROMPTS[persona.id];

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "messages must be a non-empty array." },
      { status: 400 },
    );
  }

  const history = messages.filter(isValidMessage);

  // Give the model the user's name as extra context when we have it.
  const systemContent =
    typeof userName === "string" && userName.trim()
      ? `${systemPrompt}\n\nThe user's name is ${userName.trim()}. Address them by name occasionally and naturally.`
      : systemPrompt;

  const chatMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: systemContent },
    ...history,
  ];

  try {
    const client = getOpenAIClient();
    const completion = await client.chat.completions.create({
      model: CHAT_MODEL,
      messages: chatMessages,
      temperature: 0.8,
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "The model returned an empty response." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    // Log the real error server-side, but never leak details (or the key) to
    // the client.
    console.error("[/api/chat] OpenAI request failed:", error);
    return NextResponse.json(
      { error: "Something went wrong while generating a reply." },
      { status: 502 },
    );
  }
}
