import type { CSSProperties } from "react";

import type { PersonaConfig } from "@/types";

/**
 * Clickable icebreaker chips shown in the empty chat state. Selecting one goes
 * through the exact same send path as typing the question by hand.
 */
export default function SuggestedQuestions({
  persona,
  onSelect,
  disabled,
}: {
  persona: PersonaConfig;
  onSelect: (question: string) => void;
  disabled?: boolean;
}) {
  if (persona.suggestedQuestions.length === 0) return null;

  return (
    <div
      className="flex flex-wrap justify-center gap-2"
      style={{ "--accent": persona.accent } as CSSProperties}
    >
      {persona.suggestedQuestions.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          disabled={disabled}
          className="cursor-pointer rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-600 shadow-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
