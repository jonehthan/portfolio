export type SpotifyLink = {
  type: "track" | "album" | "playlist";
  id: string;
};

const SPOTIFY_URL_PATTERN =
  /^https:\/\/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/;

export function parseSpotifyUrl(url: string): SpotifyLink | null {
  const match = url.trim().match(SPOTIFY_URL_PATTERN);
  if (!match) return null;
  return { type: match[1] as SpotifyLink["type"], id: match[2] };
}

export function toEmbedUrl(url: string): string | null {
  const parsed = parseSpotifyUrl(url);
  if (!parsed) return null;
  return `https://open.spotify.com/embed/${parsed.type}/${parsed.id}`;
}
