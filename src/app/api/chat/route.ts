import OpenAI from "openai";
import { NextResponse } from "next/server";

import { CHAT_MODEL, getOpenAIClient } from "@/lib/openai";
import { getPersona } from "@/lib/personas";
import { HITESH_SYSTEM_PROMPT } from "@/lib/prompts/hitesh";
import { PIYUSH_SYSTEM_PROMPT } from "@/lib/prompts/piyush";
import { searchPersonaVideos } from "@/lib/youtube";
import type { PersonaId, YouTubeResult } from "@/types";

// Lets the model pull up the persona's own YouTube videos when a user wants to
// learn a topic. The model decides when to call it and extracts the topic.
const YOUTUBE_TOOL: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "search_youtube",
    description:
      "Search THIS educator's own YouTube channel(s) for videos or playlists teaching a topic. Call this whenever the user expresses wanting to learn, understand, or find resources on a specific technical topic (even if phrased vaguely). Extract the core topic as a concise search query.",
    parameters: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description:
            "The concise topic to search for, e.g. 'docker', 'react hooks', 'jwt authentication'.",
        },
      },
      required: ["topic"],
    },
  },
};

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
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const client = getOpenAIClient();

    // First pass: the model answers directly, or asks to search YouTube.
    const first = await client.chat.completions.create({
      model: CHAT_MODEL,
      messages: chatMessages,
      temperature: 0.8,
      tools: [YOUTUBE_TOOL],
      tool_choice: "auto",
    });

    const firstMessage = first.choices[0]?.message;
    if (!firstMessage) {
      return NextResponse.json(
        { error: "The model returned an empty response." },
        { status: 502 },
      );
    }

    const toolCall = firstMessage.tool_calls?.find(
      (t): t is OpenAI.Chat.Completions.ChatCompletionMessageFunctionToolCall =>
        t.type === "function",
    );
    if (!toolCall) {
      const reply = firstMessage.content?.trim();
      if (!reply) {
        return NextResponse.json(
          { error: "The model returned an empty response." },
          { status: 502 },
        );
      }
      return NextResponse.json({ reply });
    }

    // Second pass: run the search, then let the model reply using the results
    // (or their absence, which it turns into an in-character "not yet" line).
    let topic = "";
    try {
      topic =
        (JSON.parse(toolCall.function.arguments) as { topic?: string }).topic?.trim() ??
        "";
    } catch {
      topic = "";
    }

    let videos: YouTubeResult[] = [];
    try {
      if (topic) videos = await searchPersonaVideos(persona.id, topic);
    } catch (error) {
      console.error("[/api/chat] YouTube search failed:", error);
    }

    const toolResult =
      videos.length > 0
        ? `Found ${videos.length} matching item(s) on your own channel(s): ${videos
            .map((v) => `"${v.title}" (${v.channelTitle})`)
            .join(
              "; ",
            )}. Tell the user, briefly and in character, that you do have content on this and to check the cards shown right below your message. Do NOT paste raw URLs — the cards handle that.`
        : `No matching video was found on your own channel(s) for "${topic || "this topic"}". You don't have a dedicated video on it yet. Respond briefly and in character: they can learn it free on YouTube for now, and videos on this are coming soon.`;

    const second = await client.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.8,
      messages: [
        ...chatMessages,
        firstMessage,
        { role: "tool", tool_call_id: toolCall.id, content: toolResult },
      ],
    });

    const reply = second.choices[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "The model returned an empty response." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply, videos });
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
