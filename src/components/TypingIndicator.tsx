import type { PersonaConfig } from "@/types";
import Avatar from "./Avatar";

/** Shown while the (currently faked) bot response is being prepared. */
export default function TypingIndicator({
  persona,
}: {
  persona: PersonaConfig;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 shrink-0">
        <Avatar
          src={persona.avatarSrc}
          alt={persona.displayName}
          initials={persona.initials}
          accent={persona.accent}
          size={32}
        />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-stone-200 bg-white px-4 py-3.5 shadow-sm">
        <span className="sr-only">{persona.displayName} is typing…</span>
        {[0, 180, 360].map((delay) => (
          <span
            key={delay}
            className="h-2 w-2 rounded-full bg-stone-400"
            style={{
              animation: "typing-dot 1.2s ease-in-out infinite",
              animationDelay: `${delay}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
