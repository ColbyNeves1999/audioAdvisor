type DatabaseConstraintError = {
  type: 'unique' | 'check' | 'not null' | 'foreign key' | 'unknown';
  columnName?: string;
  message?: string;
};

type AuthRequest = {
  email: string;
  password: string;
};

type SpotifyTokenResponse = {
  access_token: string;
  refresh_token: string;
};

type SpotifyUserData = {
  id: string;
};

type NewUserId = {
  userId: string;
};
////////////////////////////////////////////////////////////////////////////

type spotArtName = {
  name: string;
};

type spotSongRelease = {
  release_date: string;
}

type songData = {
  artists: [spotArtName];
  id: string;
  name: string;
  album: spotSongRelease;
};

type SpotifySongData = {
  items: [songData];
  limit: number;
};

type tracks = {
  tracks: SpotifySongData;
};

