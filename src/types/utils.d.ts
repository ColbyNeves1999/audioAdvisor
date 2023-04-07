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

type songData = {
  id: string;
  name: string;
  artists: string[];
};

type SpotifySongData = {
  limit: number;
  items: [songData];
};

type tracks = {
  tracks: SpotifySongData;
};
