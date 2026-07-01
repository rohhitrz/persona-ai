import type { ChatMessage, PersonaConfig } from "@/types";
import Avatar from "./Avatar";
import MarkdownMessage from "./MarkdownMessage";

/** A single chat message — user bubbles align right, bot bubbles left. */
export default function MessageBubble({
  message,
  persona,
}: {
  message: ChatMessage;
  persona: PersonaConfig;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed text-white"
          style={{ backgroundColor: persona.accent }}
        >
          {message.content}
        </div>
      </div>
    );
  }

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
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-stone-200 bg-white px-4 py-2.5 shadow-sm">
        <MarkdownMessage content={message.content} />
      </div>
    </div>
  );
}
