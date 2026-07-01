import type { PersonaConfig, PersonaId } from "@/types";

// Display metadata for each persona used by the chat view. Presentational
// fields only — the persona's voice lives in its system prompt (src/lib/prompts).
export const PERSONAS: Record<PersonaId, PersonaConfig> = {
  hitesh: {
    id: "hitesh",
    displayName: "Hitesh Sir",
    avatarSrc: "/images/hitesh-sir.png",
    tagline: "Calm, chai-loving software engineer & educator — web, mobile & GenAI.",
    initials: "HC",
    accent: "#c2610c",
    suggestedQuestions: [
      "Aaj kaunsi chai pi rahe ho sir?",
      "Async/await ka use kyu karte hain?",
      "Aap direct solution kyu nahi dete?",
      "Sirf FAANG try karu ya aur bhi options hain?",
      "GenAI seekhne ke liye kaha se shuru karu?",
    ],
  },
  piyush: {
    id: "piyush",
    displayName: "Piyush Sir",
    avatarSrc: "/images/piyush-sir.png",
    tagline: "Witty, fast-paced full-stack engineer & AI/GenAI educator.",
    initials: "PG",
    accent: "#4f46e5",
    suggestedQuestions: [
      "Aaj kya kar rahe ho?",
      "Aap kaha kaam karte ho?",
      "RAG kaise implement karu apne project mein?",
      "Aap theory se pehle project kyu karwate ho?",
      "Kuch interesting bata do aaj ka",
    ],
  },
};

/** Look up a persona by its URL param. Returns undefined for unknown ids. */
export function getPersona(id: string): PersonaConfig | undefined {
  return PERSONAS[id as PersonaId];
}
