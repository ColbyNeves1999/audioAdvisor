import { Request, Response } from 'express';
import { Buffer } from 'buffer';
import querystring from 'querystring';
import { generateRandomString, refreshAuth, storeAuth } from '../models/SpotifyModel';
import { getUserByEmail } from '../models/UserModel';
import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';
import { decrypt } from '../utils/encrypt';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
var stateKey = 'spotify_auth_state';
const { PORT } = process.env;

const userRepository = AppDataSource.getRepository(User);
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

//Spotify login
function spotifyLogin(req: Request, res: Response): void {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = 'user-read-private user-read-email';

  var myObj = {
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
    state: state
  }

  const myJSON = querystring.stringify(myObj);

  //Redirects to spotify but with the callBack function 
  //so that when it comes back, the user is directed there
  res.redirect(`https://accounts.spotify.com/authorize?` + myJSON);


};

//Getting a token from Spotify
async function callBack(req: Request, res: Response): Promise<void> {

  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code as string || null;
  var state = req.query.state as string || null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);

    //Creating the object that contains all data needed for authorization
    var myObj = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    }

    var myJSON = querystring.stringify(myObj);

    //Queries spotify for a access token
    const fetchResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: myJSON,
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const resJson = await fetchResponse.json();

    //Used to troubleshoot responses
    //console.log(resJson);

    const { access_token, refresh_token } = resJson as SpotifyTokenResponse;

    //Stores user authentification token
    await storeAuth(access_token, refresh_token, req.session.authenticatedUser.email);
    const user = await getUserByEmail(req.session.authenticatedUser.email);

    //Classifying user as authorized
    user.accountAuthorized = true;
    await userRepository.save(user);

    req.session.authenticatedUser.accountAuthorized = user.accountAuthorized;
    req.session.authenticatedUser.userId = user.userId;
    //req.session.authenticatedUser.authToken = decrypt(user.spotifyAuth);
    //req.session.authenticatedUser.refreshToken = decrypt(user.refreshAuth);
    req.session.authenticatedUser.authToken = user.spotifyAuth;
    req.session.authenticatedUser.refreshToken = user.refreshAuth;


    //sends user to main page once they have authentification token
    //res.send(200).redirect('http://localhost:3000');
    res.redirect(`http://localhost:${PORT}/api/spotifyId`);

  }



};

//Refreshing a token from spotify
async function refreshToken(req: Request, res: Response): Promise<void> {
  //var refresh_token = decrypt(req.session.authenticatedUser.refreshToken) as string || null;
  var refresh_token = req.session.authenticatedUser.refreshToken as string || null;

  if (!req.session.isLoggedIn || !req.session.authenticatedUser.authToken || !req.session.authenticatedUser.refreshToken) {
    res.sendStatus(404);
    return;
  }

  var myObj = {
    grant_type: 'refresh_token',
    refresh_token: refresh_token,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  }

  var myJSON = querystring.stringify(myObj);

  //Queries spotify for a access token
  const fetchResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: myJSON,
    headers: {
      'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  const resJson = await fetchResponse.json();

  //Used to troubleshoot responses
  //console.log(resJson);

  //Refreshes authentification code and saves it for the user.
  const { access_token } = resJson as SpotifyTokenResponse;
  await refreshAuth(access_token, req.session.authenticatedUser.email);

  //Makes sure the current user gets the newest authentification code
  const user = await getUserByEmail(req.session.authenticatedUser.email);
  //req.session.authenticatedUser.authToken = decrypt(user.spotifyAuth);
  req.session.authenticatedUser.authToken = user.spotifyAuth;

  //const user = await getUserByEmail("colby.neves@smail.astate.edu");
  //req.session.authenticatedUser.authToken = user.spotifyAuth;

  //Sends user to main page upon successful login
  res.redirect('http://localhost:3000');

}

export { spotifyLogin, callBack, refreshToken };
