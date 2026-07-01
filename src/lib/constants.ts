import type { Persona } from "@/types";

// The two mentors users can chat with. Persona prompts and OpenAI wiring
// will live alongside this in later phases — for now it just drives the
// landing page cards.
export const PERSONAS: Persona[] = [
  {
    id: "hitesh",
    name: "Hitesh Choudhary",
    cardTitle: "Chat with Hitesh Sir",
    tagline: "Calm, chai-loving software engineer & educator — web, mobile & GenAI.",
    image: "/images/hitesh-sir.png",
    initials: "HC",
    accent: "#c2610c", // warm amber — a subtle nod to the chai
    href: "/chat/hitesh",
  },
  {
    id: "piyush",
    name: "Piyush Garg",
    cardTitle: "Chat with Piyush Sir",
    tagline: "Witty, fast-paced full-stack engineer & AI/GenAI educator.",
    image: "/images/piyush-sir.png",
    initials: "PG",
    accent: "#4f46e5", // indigo — a cooler, more technical tone
    href: "/chat/piyush",
  },
];
