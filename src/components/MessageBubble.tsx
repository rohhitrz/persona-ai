import type { PersonaConfig, UiMessage } from "@/types";
import Avatar from "./Avatar";
import MarkdownMessage from "./MarkdownMessage";
import VideoResults from "./VideoResults";

/** A single chat message — user bubbles align right, bot bubbles left. */
export default function MessageBubble({
  message,
  persona,
  onRetry,
}: {
  message: UiMessage;
  persona: PersonaConfig;
  /** When provided, a failed message shows a retry button. */
  onRetry?: () => void;
}) {
  if (message.role === "error") {
    return (
      <div className="flex justify-center">
        <div className="flex max-w-[90%] flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-600">
          <span>{message.content}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="font-semibold text-red-700 underline underline-offset-2 hover:text-red-900"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

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
      <div className="max-w-[85%]">
        <div className="rounded-2xl rounded-tl-sm border border-stone-200 bg-white px-4 py-2.5 shadow-sm">
          <MarkdownMessage content={message.content} />
        </div>
        {message.videos && message.videos.length > 0 && (
          <VideoResults videos={message.videos} />
        )}
      </div>
    </div>
  );
}
