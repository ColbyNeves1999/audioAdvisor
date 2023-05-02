import { Request, Response } from 'express';
import argon2 from 'argon2';
import {
  addUser,
  getUserByEmail,
  setUserSpotId,
  getUserById,
  updateEmailAddress,
  setUserGenre,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';
import { getGamesWon } from '../models/GameModel';
import { addGameWinner } from '../models/GameModel';

const { PORT } = process.env;

async function registerUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as AuthRequest;
  const user = await getUserByEmail(email);

  if (user) {
    res.sendStatus(409);
  }

  // IMPORTANT: Hash the password
  const passwordHash = await argon2.hash(password);

  try {
    // IMPORTANT: Store the `passwordHash` and NOT the plaintext password

    await addUser(email, passwordHash);
    res.redirect(`http://localhost:${PORT}/login`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {

  const { email, password } = req.body as AuthRequest;

  const user = await getUserByEmail(email);

  if (!user) {
    res.redirect(`/login`);
  }

  const { passwordHash } = user;

  if (!(await argon2.verify(passwordHash, password))) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  await req.session.clearSession();
  req.session.authenticatedUser = {
    email: user.email,
    accountAuthorized: user.accountAuthorized,
    userId: user.userId,
    authToken: user.spotifyAuth,
    refreshToken: user.refreshAuth,
    spotifyId: user.spotifyId,
    questionsCorrect: user.questionsCorrect,
  };
  req.session.isLoggedIn = true;
  req.session.urlArray = null;
  req.session.questionNumber = 0;

  const temp = await !getGamesWon(req.session.authenticatedUser.userId);
  if(temp === false){
    await addGameWinner(req.session.authenticatedUser.userId);
  }

  //Redirects the user to make sure they get a current authorization token
  if (req.session.authenticatedUser.authToken === null) {
    res.redirect(`http://localhost:${PORT}/api/spotifyLogin`);
  } else {
    res.redirect(`http://localhost:${PORT}/api/refreshToken`);
  }
}

async function logOut(req: Request, res: Response): Promise<void> {

  //await req.session.clearSession();
  req.session.isLoggedIn = false;
  res.redirect(`/index`);

}

async function getSpotifyId(req: Request, res: Response): Promise<void> {

  if (!req.session.authenticatedUser.authToken) {
    res.redirect(`/login`);
  }

  //Requests the spotifyID of the user's authorized Spotify account
  const result = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${req.session.authenticatedUser.authToken}`,
    },
  });

  if (!result.ok) {
    console.log(res.status);
  }

  const data = await result.json();

  const { id } = data as SpotifyUserData;

  await setUserSpotId(req.session.authenticatedUser.userId, id);
  const user = await getUserByEmail(req.session.authenticatedUser.email);

  req.session.authenticatedUser.spotifyId = user.spotifyId;
  const gamesWon = (await getGamesWon(req.session.authenticatedUser.userId)).gamesWon;

  //Makes sure the user ends up back at their homepage afterwards
  res.render('userHomePage', { user, gamesWon });

}

async function updateUserEmail(req: Request, res: Response): Promise<void> {
  const { targetUserId } = req.params as UserIdParam;

  // NOTES: Access the data from `req.session`
  const { isLoggedIn } = req.session;

  // NOTES: We need to make sure that this client is logged in AND
  //        they are try to modify their own user account
  if (!isLoggedIn) {
    res.sendStatus(403); // 403 Forbidden
    return;
  }

  const { email } = req.body as UserIdParam;

  // Get the user account
  const user = await getUserById(req.session.authenticatedUser.userId);

  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  // Now update their email address
  try {
    await updateEmailAddress(targetUserId, email);
    console.log('hello');
    const gamesWon = (await getGamesWon(req.session.authenticatedUser.userId)).gamesWon;

    res.render('userHomePage', { user, gamesWon });
    
  } catch (err) {
    // The email was taken so we need to send an error message
    console.error(err);
    //const databaseErrorMessage = parseDatabaseError(err);
    const gamesWon = (await getGamesWon(req.session.authenticatedUser.userId)).gamesWon;

    res.render('userHomePage', { user, gamesWon });
  }

}

async function updateUserGenre(req: Request, res: Response): Promise<void> {

  const { favoriteGenre } = req.body as userGenre;

  // NOTES: Access the data from `req.session`
  const { isLoggedIn, authenticatedUser } = req.session;

  // NOTES: We need to make sure that this client is logged in AND
  //        they are try to modify their own user account
  if (!isLoggedIn) {
    res.redirect('/login');
  }

  await setUserGenre(authenticatedUser.userId, favoriteGenre);

  const user = await getUserByEmail(req.session.authenticatedUser.email);

  req.session.authenticatedUser.spotifyId = user.spotifyId;
  const gamesWon = (await getGamesWon(req.session.authenticatedUser.userId)).gamesWon;

  res.render('userHomePage', { user, gamesWon });

}

export { registerUser, logIn, getSpotifyId, updateUserEmail, updateUserGenre, logOut };
