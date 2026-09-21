import type { SpotifyLink } from "@/lib/spotify-url";

export type SpotifyMeta = {
  title: string;
  subtitle: string;
  thumbnailUrl: string | null;
};

const TIMEOUT_MS = 5000;

const TYPE_LABEL: Record<SpotifyLink["type"], string> = {
  track: "Song",
  album: "Album",
  playlist: "Playlist",
};

async function getAppToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) return null;
  const json = await response.json();
  return json.access_token as string;
}

// Artist (tracks, albums) or owner (playlists). Best effort: Spotify's own
// editorial playlists aren't visible to app tokens, so this can come back null.
async function fetchSubtitle(link: SpotifyLink): Promise<string | null> {
  try {
    const token = await getAppToken();
    if (!token) return null;

    const path =
      link.type === "playlist"
        ? `playlists/${link.id}?fields=owner(display_name)`
        : `${link.type}s/${link.id}`;
    const response = await fetch(`https://api.spotify.com/v1/${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const json = await response.json();
    if (link.type === "playlist") return json.owner?.display_name ?? null;
    const artists = (json.artists as { name: string }[] | undefined)?.map((a) => a.name);
    return artists && artists.length > 0 ? artists.join(", ") : null;
  } catch {
    return null;
  }
}

// Title and cover come from Spotify's public oEmbed endpoint (no key needed).
// Returns null when Spotify doesn't recognise the link.
export async function fetchSpotifyMeta(link: SpotifyLink): Promise<SpotifyMeta | null> {
  try {
    const url = `https://open.spotify.com/${link.type}/${link.id}`;
    const response = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
      { signal: AbortSignal.timeout(TIMEOUT_MS) }
    );
    if (!response.ok) return null;

    const json = await response.json();
    if (typeof json.title !== "string" || json.title.length === 0) return null;

    const subtitle = await fetchSubtitle(link);
    return {
      title: json.title,
      subtitle: subtitle ?? TYPE_LABEL[link.type],
      thumbnailUrl: typeof json.thumbnail_url === "string" ? json.thumbnail_url : null,
    };
  } catch {
    return null;
  }
}
