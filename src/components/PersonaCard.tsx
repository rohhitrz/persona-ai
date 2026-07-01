import Link from "next/link";

import type { Persona } from "@/types";
import Avatar from "./Avatar";

/**
 * A single mentor card on the landing page. Links to the (not-yet-built)
 * chat route — a 404 on click is expected at this stage.
 */
export default function PersonaCard({ persona }: { persona: Persona }) {
  return (
    <Link
      href={persona.href}
      className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 sm:items-start sm:text-left"
    >
      {/* Thin accent strip along the top, unique per persona. */}
      <span
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ backgroundColor: persona.accent }}
      />

      <Avatar
        src={persona.image}
        alt={persona.name}
        initials={persona.initials}
        accent={persona.accent}
      />

      <h2 className="mt-5 text-xl font-semibold text-stone-900">
        {persona.cardTitle}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-500">
        {persona.tagline}
      </p>

      <span
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium"
        style={{ color: persona.accent }}
      >
        Start chatting
        <span
          aria-hidden
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </Link>
  );
}
