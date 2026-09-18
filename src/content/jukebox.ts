export type CuratedSong = {
  spotifyUrl: string;
  caption?: string;
};

// Your own picks — add a track/album/playlist link (open.spotify.com/...)
// and an optional caption. Left empty rather than seeded with placeholders.
export const curatedSongs: CuratedSong[] = [];
