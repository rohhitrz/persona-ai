import type { PersonaId, YouTubeResult } from "@/types";

// Real channel IDs, resolved from each persona's public handles.
// Hitesh Sir has two channels (Hindi + English); Piyush Sir has one.
const PERSONA_CHANNELS: Record<PersonaId, string[]> = {
  hitesh: [
    "UCNQ6FEtztATuaVhZKCY28Yw", // Chai aur Code (Hindi)
    "UCXgGY0wkgOzynnHvSEVmE3A", // Hitesh Choudhary (English)
  ],
  piyush: [
    "UCf9T51_FmMlfhiGpoes0yFA", // Piyush Garg
  ],
};

const SEARCH_ENDPOINT = "https://www.googleapis.com/youtube/v3/search";
const MAX_PER_CHANNEL = 3;
const MAX_TOTAL = 4;

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

type SearchItem = {
  id?: { kind?: string; videoId?: string; playlistId?: string };
  snippet?: {
    title?: string;
    channelTitle?: string;
    thumbnails?: Record<string, { url?: string } | undefined>;
  };
};

function toResult(item: SearchItem): YouTubeResult | null {
  const kind =
    item.id?.kind === "youtube#playlist"
      ? "playlist"
      : item.id?.kind === "youtube#video"
        ? "video"
        : null;
  if (!kind) return null;

  const id = kind === "playlist" ? item.id?.playlistId : item.id?.videoId;
  if (!id) return null;

  const url =
    kind === "playlist"
      ? `https://www.youtube.com/playlist?list=${id}`
      : `https://www.youtube.com/watch?v=${id}`;

  const thumbnails = item.snippet?.thumbnails ?? {};
  const thumbnail = thumbnails.medium?.url ?? thumbnails.default?.url ?? "";

  return {
    id,
    kind,
    title: decodeEntities(item.snippet?.title ?? ""),
    url,
    thumbnail,
    channelTitle: item.snippet?.channelTitle ?? "",
  };
}

async function searchChannel(
  channelId: string,
  topic: string,
  apiKey: string,
): Promise<YouTubeResult[]> {
  const url = new URL(SEARCH_ENDPOINT);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("channelId", channelId);
  url.searchParams.set("q", topic);
  url.searchParams.set("type", "video,playlist");
  url.searchParams.set("order", "relevance");
  url.searchParams.set("maxResults", String(MAX_PER_CHANNEL));
  url.searchParams.set("key", apiKey);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube search failed with status ${res.status}`);

  const data = (await res.json()) as { items?: SearchItem[] };
  return (data.items ?? [])
    .map(toResult)
    .filter((r): r is YouTubeResult => r !== null);
}

/**
 * Search a persona's own YouTube channel(s) for videos/playlists on a topic.
 * Returns an empty array when the topic isn't covered — the caller uses that
 * as the signal to respond "no video yet" in character.
 */
export async function searchPersonaVideos(
  personaId: PersonaId,
  topic: string,
): Promise<YouTubeResult[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is not set.");

  const channels = PERSONA_CHANNELS[personaId];
  const perChannel = await Promise.all(
    channels.map((channelId) =>
      searchChannel(channelId, topic, apiKey).catch(() => []),
    ),
  );

  const seen = new Set<string>();
  const results: YouTubeResult[] = [];
  for (const result of perChannel.flat()) {
    if (seen.has(result.id)) continue;
    seen.add(result.id);
    results.push(result);
    if (results.length >= MAX_TOTAL) break;
  }
  return results;
}
