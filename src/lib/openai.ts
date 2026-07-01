import OpenAI from "openai";

/**
 * Chat model used for all persona responses. Kept here as a single constant
 * so it's easy to swap later without hunting through route handlers.
 * gpt-4o-mini is a solid, cost-reasonable default for a chat app like this.
 */
export const CHAT_MODEL = "gpt-4o-mini";

let client: OpenAI | null = null;

/**
 * Lazily create the OpenAI client. The API key is only checked here (at call
 * time), not at import time, so a missing key never breaks the build — only an
 * actual chat request will fail, with a clear message.
 */
export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to your .env.local file to enable chat.",
    );
  }
  if (!client) {
    client = new OpenAI({ apiKey });
  }
  return client;
}
