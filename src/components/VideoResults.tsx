import type { YouTubeResult } from "@/types";

/** Clickable cards for a persona's YouTube videos/playlists, shown under a reply. */
export default function VideoResults({ videos }: { videos: YouTubeResult[] }) {
  if (videos.length === 0) return null;

  return (
    <div className="mt-3 flex flex-col gap-2">
      {videos.map((video) => (
        <a
          key={`${video.kind}-${video.id}`}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-2 transition-colors hover:border-stone-300 hover:bg-stone-50"
        >
          {video.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.thumbnail}
              alt=""
              className="h-12 w-20 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="h-12 w-20 shrink-0 rounded-lg bg-stone-100" />
          )}
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-medium text-stone-800 group-hover:text-stone-900">
              {video.title}
            </p>
            <p className="mt-0.5 truncate text-xs text-stone-500">
              {video.channelTitle}
              {video.kind === "playlist" ? " · Playlist" : ""}
            </p>
          </div>
          <span aria-hidden className="pr-1 text-stone-400 group-hover:text-red-500">
            ▶
          </span>
        </a>
      ))}
    </div>
  );
}
