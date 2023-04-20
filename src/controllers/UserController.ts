import { Request, Response } from 'express';
import argon2 from 'argon2';
import {
  addUser,
  getUserByEmail,
  setUserSpotId,
  getUserById,
  updateEmailAddress,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

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
    // const newUser = await addUser(email, passwordHash);
    // console.log(newUser);
    await addUser(email, passwordHash);
    res.redirect(`http://localhost:${PORT}/login`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  console.log(req.session);

  const { email, password } = req.body as AuthRequest;

  const user = await getUserByEmail(email);

  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  const { passwordHash } = user;

  if (!(await argon2.verify(passwordHash, password))) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  req.session.authenticatedUser = {
    email: user.email,
    accountAuthorized: user.accountAuthorized,
    userId: user.userId,
    authToken: user.spotifyAuth,
    refreshToken: user.refreshAuth,
    spotifyId: user.spotifyId,
  };
  req.session.isLoggedIn = true;

  //Redirects the user to make sure they get a current authorization token
  if (req.session.authenticatedUser.authToken === null) {
    res.redirect(`http://localhost:${PORT}/api/spotifyLogin`);
  } else {
    res.redirect(`http://localhost:${PORT}/api/refreshToken`);
  }
}

async function getSpotifyId(req: Request, res: Response): Promise<void> {
  
  if (!req.session.authenticatedUser.authToken) {
    res.sendStatus(404);
    return;
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

  //Makes sure the user ends up back at their homepage afterwards
  res.render('userHomePage', { user });

}

async function updateUserEmail(req: Request, res: Response): Promise<void> {
  const { targetUserId } = req.params as UserIdParam;

  // NOTES: Access the data from `req.session`
  const { isLoggedIn, authenticatedUser } = req.session;

  // NOTES: We need to make sure that this client is logged in AND
  //        they are try to modify their own user account
  if (!isLoggedIn || authenticatedUser.userId !== targetUserId) {
    res.sendStatus(403); // 403 Forbidden
    return;
  }

  const { email } = req.body as { email: string };

  // Get the user account
  const user = await getUserById(targetUserId);

  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  // Now update their email address
  try {
    await updateEmailAddress(targetUserId, email);
  } catch (err) {
    // The email was taken so we need to send an error message
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
    return;
  }

  res.sendStatus(200);
}

export { registerUser, logIn, getSpotifyId, updateUserEmail };
