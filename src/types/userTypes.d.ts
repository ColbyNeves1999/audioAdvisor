type UserIdParam = {
  targetUserId: string;
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