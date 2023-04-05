import { Request, Response } from 'express';
import argon2 from 'argon2';
import { addUser, getUserByEmail, setUserSpotId } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

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
    const newUser = await addUser(email, passwordHash);
    console.log(newUser);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }

}

async function logIn(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as AuthRequest;

  const user = await getUserByEmail(email);

  // Check if the user account exists for that email
  if (!user) {
    res.sendStatus(404); // 404 Not Found 
    return;
  }

  // The account exists so now we can check their password
  const { passwordHash } = user;

  // If the password does not match
  if (!(await argon2.verify(passwordHash, password))) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  // The user has successfully logged in
  // NOTES: We will update this once we implement session management

  //await req.session.clearSession();
  req.session.authenticatedUser = {
    email: user.email,
    accountAuthorized: user.accountAuthorized,
    userId: user.userId,
    authToken: user.spotifyAuth,
    refreshToken: user.refreshAuth,
  };
  req.session.isLoggedIn = true;

  if (user.accountAuthorized === false) {
    res.redirect("http://localhost:7444/api/spotifyLogin");
    return;
  }

  res.sendStatus(200);

}

async function getSpotifyId(req: Request, res: Response): Promise<void> {

  if(!req.session.authenticatedUser.authToken){
    res.sendStatus(404);
    return;
  }

  const result = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + req.session.authenticatedUser.authToken
    }
  });

  if (!result.ok) {
    console.log(res.status);
  }

  //const responseBodyTest = await result.text();
  //console.log(responseBodyTest);

  const data = await result.json();

  const { id } = data as SpotifyUserData;

  await setUserSpotId(req.session.authenticatedUser.userId, id);

  res.sendStatus(200);

}

export { registerUser, logIn, getSpotifyId };
