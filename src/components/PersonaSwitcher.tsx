"use client";

import Link from "next/link";

import { PERSONAS } from "@/lib/personas";
import type { PersonaId } from "@/types";
import Avatar from "./Avatar";

/**
 * Compact switcher shown in the chat header — jump straight to the other
 * persona's chat without going back to the home page. Each persona's
 * conversation lives in its own remounted ChatRoom (keyed by persona id), so
 * switching here never mixes one persona's context into the other's.
 */
export default function PersonaSwitcher({ activeId }: { activeId: PersonaId }) {
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-full border border-stone-200 bg-white p-1">
      {Object.values(PERSONAS).map((persona) => {
        const isActive = persona.id === activeId;
        return (
          <Link
            key={persona.id}
            href={`/chat/${persona.id}`}
            aria-label={`Switch to ${persona.displayName}`}
            aria-current={isActive ? "page" : undefined}
            className="rounded-full p-0.5 transition-opacity hover:opacity-100"
            style={{
              boxShadow: isActive ? `0 0 0 2px ${persona.accent}` : "none",
              opacity: isActive ? 1 : 0.45,
            }}
          >
            <Avatar
              src={persona.avatarSrc}
              alt={persona.displayName}
              initials={persona.initials}
              accent={persona.accent}
              size={28}
            />
          </Link>
        );
      })}
    </div>
  );
}
