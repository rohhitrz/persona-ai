import type { PersonaConfig, PersonaId } from "@/types";

// Display metadata for each persona used by the chat view. Keep this to
// presentational fields only — the persona's actual voice/system prompt is
// added in Phase 3/4.
export const PERSONAS: Record<PersonaId, PersonaConfig> = {
  hitesh: {
    id: "hitesh",
    displayName: "Hitesh Sir",
    avatarSrc: "/images/hitesh-sir.png",
    tagline: "Calm, composed, chai-loving mentor for web dev & GenAI.",
    initials: "HC",
    accent: "#c2610c",
  },
  piyush: {
    id: "piyush",
    displayName: "Piyush Sir",
    avatarSrc: "/images/piyush-sir.png",
    tagline: "Witty, fast-paced, project-first full-stack educator.",
    initials: "PG",
    accent: "#4f46e5",
  },
};

/** Look up a persona by its URL param. Returns undefined for unknown ids. */
export function getPersona(id: string): PersonaConfig | undefined {
  return PERSONAS[id as PersonaId];
}
