// Shared types for the app. This will grow as we add chat, messages, etc.

export type PersonaId = "hitesh" | "piyush";

export interface Persona {
  id: PersonaId;
  /** Full real name, used for alt text and (later) the chat header. */
  name: string;
  /** Headline shown on the landing page card. */
  cardTitle: string;
  /** One-line description of the persona's vibe. */
  tagline: string;
  /** Path under /public for the avatar image. May not exist yet. */
  image: string;
  /** Fallback initials shown if the avatar image is missing. */
  initials: string;
  /** Accent colour (hex) used for subtle per-persona theming. */
  accent: string;
  /** Where the card links to. Chat routes come in a later phase. */
  href: string;
}
