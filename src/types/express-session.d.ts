import 'express-session';
import { Song } from '../entities/Song';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>; // DO NOT MODIFY THIS!

    // NOTES: Our example app's custom session properties:
    authenticatedUser: {
      email: string;
      accountAuthorized: boolean;
      userId: string;
      authToken: string;
      refreshToken: string;
      spotifyId: string;
      questionsCorrect: number;
    };
    isLoggedIn: boolean;
    logInAttempts: number;
    logInTimeout: string;
    urlArray: Song[];
    questionNumber: number;
    previousRecommendation: Song;
    genreArray: string;
    favoriteGenre: string;

  }
}
