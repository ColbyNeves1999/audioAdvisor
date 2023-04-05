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

type tracks = {
  items: string[];
  id: string;
  limit: string;
};

type SpotifySongData = {
  tracks: tracks;
};
