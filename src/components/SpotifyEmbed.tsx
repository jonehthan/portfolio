import { parseSpotifyUrl, toEmbedUrl } from "@/lib/spotify-url";

export function SpotifyEmbed({ url }: { url: string }) {
  const parsed = parseSpotifyUrl(url);
  const embedUrl = toEmbedUrl(url);

  if (!parsed || !embedUrl) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="text-sm underline">
        {url}
      </a>
    );
  }

  const height = parsed.type === "track" ? 152 : 352;

  return (
    <iframe
      src={embedUrl}
      width="100%"
      height={height}
      style={{ borderRadius: 12 }}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
