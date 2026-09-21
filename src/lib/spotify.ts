export type EarlierTrack = {
  name: string;
  artist: string;
  url: string;
  albumArt: string;
  playedAt: string;
};

export type SpotifySnapshot = (
  | {
      isPlaying: true;
      track: {
        name: string;
        artist: string;
        url: string;
        albumArt: string | null;
      };
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
    }
) & {
  // Older plays with distinct covers, newest first. Absent on snapshots saved
  // before this field existed.
  earlier?: EarlierTrack[];
};

const EARLIER_LIMIT = 4;
const REQUEST_TIMEOUT_MS = 4000;
// Fetch more than we show: repeats and same-album plays get filtered out.
const RECENT_FETCH_LIMIT = 20;

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
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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

type RecentItem = { track: SpotifyTrackItem; played_at: string };

// Newest-first plays after `skipFirst` items, keeping one per album cover and
// dropping anything that shares a cover with `shownArt` (the current track).
function pickEarlier(
  items: RecentItem[],
  skipFirst: number,
  shownArt: string | null,
): EarlierTrack[] {
  const seen = new Set<string>(shownArt ? [shownArt] : []);
  const earlier: EarlierTrack[] = [];

  for (const item of items.slice(skipFirst)) {
    const track = trackFromItem(item.track);
    if (!track.albumArt || seen.has(track.albumArt)) continue;
    seen.add(track.albumArt);
    earlier.push({
      ...track,
      albumArt: track.albumArt,
      playedAt: item.played_at,
    });
    if (earlier.length === EARLIER_LIMIT) break;
  }

  return earlier;
}

export async function fetchSpotifySnapshot(): Promise<SpotifySnapshot> {
  const accessToken = await getAccessToken();
  const headers = { Authorization: `Bearer ${accessToken}` };

  const currentResponse = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    { headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }
  );

  let playing: ReturnType<typeof trackFromItem> | null = null;

  if (currentResponse.status === 200) {
    const json = await currentResponse.json();
    if (json?.is_playing && json.item) {
      playing = trackFromItem(json.item);
    }
  } else if (currentResponse.status !== 204) {
    throw new Error(
      `Spotify currently-playing error: ${currentResponse.status}`,
    );
  }

  const recentResponse = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=${RECENT_FETCH_LIMIT}`,
    { headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }
  );

  if (!recentResponse.ok) {
    throw new Error(`Spotify recently-played error: ${recentResponse.status}`);
  }

  const recentJson = await recentResponse.json();
  const items: RecentItem[] = recentJson.items ?? [];

  // While playing, every recent play is "earlier". Otherwise the newest one is
  // the featured track and the rest are earlier.
  if (playing) {
    return {
      isPlaying: true,
      track: playing,
      earlier: pickEarlier(items, 0, playing.albumArt),
    };
  }

  if (items.length === 0) {
    return { isPlaying: false, track: null };
  }

  const featured = trackFromItem(items[0].track);
  return {
    isPlaying: false,
    track: { ...featured, playedAt: items[0].played_at },
    earlier: pickEarlier(items, 1, featured.albumArt),
  };
}

// Live lookup for page loads. Cached in memory per server instance so a burst
// of visitors makes at most one Spotify round trip per TTL, and a failure is
// remembered briefly so an outage doesn't add a slow request to every load.
const LIVE_TTL_MS = 30_000;

let liveCache: { at: number; value: SpotifySnapshot } | null = null;
let liveFailedAt = 0;
let liveInflight: Promise<SpotifySnapshot> | null = null;

export async function getLiveSpotifySnapshot(): Promise<SpotifySnapshot> {
  const now = Date.now();

  if (liveCache && now - liveCache.at < LIVE_TTL_MS) return liveCache.value;
  if (now - liveFailedAt < LIVE_TTL_MS) throw new Error("Spotify live lookup recently failed");

  liveInflight ??= fetchSpotifySnapshot()
    .then((value) => {
      liveCache = { at: Date.now(), value };
      return value;
    })
    .catch((error) => {
      liveFailedAt = Date.now();
      throw error;
    })
    .finally(() => {
      liveInflight = null;
    });

  return liveInflight;
}
