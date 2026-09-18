export type SpotifySnapshot =
  | {
      isPlaying: true;
      track: { name: string; artist: string; url: string; albumArt: string | null };
    }
  | {
      isPlaying: false;
      track: {
        name: string;
        artist: string;
        url: string;
        albumArt: string | null;
        playedAt: string;
      } | null;
    };

type SpotifyTrackItem = {
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
  album: { images: { url: string }[] };
};

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Spotify credentials are not fully set");
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Spotify token refresh failed: ${response.status}`);
  }

  const json = await response.json();
  return json.access_token as string;
}

function trackFromItem(item: SpotifyTrackItem) {
  return {
    name: item.name,
    artist: item.artists.map((a) => a.name).join(", "),
    url: item.external_urls.spotify,
    albumArt: item.album.images[0]?.url ?? null,
  };
}

export async function fetchSpotifySnapshot(): Promise<SpotifySnapshot> {
  const accessToken = await getAccessToken();
  const headers = { Authorization: `Bearer ${accessToken}` };

  const currentResponse = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    { headers }
  );

  if (currentResponse.status === 200) {
    const json = await currentResponse.json();
    if (json?.is_playing && json.item) {
      return { isPlaying: true, track: trackFromItem(json.item) };
    }
  } else if (currentResponse.status !== 204) {
    throw new Error(`Spotify currently-playing error: ${currentResponse.status}`);
  }

  const recentResponse = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    { headers }
  );

  if (!recentResponse.ok) {
    throw new Error(`Spotify recently-played error: ${recentResponse.status}`);
  }

  const recentJson = await recentResponse.json();
  const item = recentJson.items?.[0];

  if (!item) {
    return { isPlaying: false, track: null };
  }

  return {
    isPlaying: false,
    track: { ...trackFromItem(item.track), playedAt: item.played_at },
  };
}
