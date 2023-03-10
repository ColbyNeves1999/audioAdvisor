import { Request, Response } from 'express';
import querystring from 'querystring';

const { CLIENT_ID } = process.env;
const { CLIENT_SECRET } = process.env;
const { REDIRECT_URI } = process.env;
const stateKey = 'spotify_auth_state';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

function generateRandomString(length: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Spotify login
function spotifyLogin(req: Request, res: Response): void {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = 'user-read-private user-read-email';

  const myObj = {
    response_type: 'code',
    client_id: CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
    state,
  };

  const myJSON = querystring.stringify(myObj);

  res.redirect(`https://accounts.spotify.com/authorize?${myJSON}`);
}

async function callBack(req: Request, res: Response): Promise<void> {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = (req.query.code as string) || null;
  const state = (req.query.state as string) || null;

  if (state === null) {
    res.redirect(
      `/#${querystring.stringify({
        error: 'state_mismatch',
      })}`
    );
  } else {
    res.clearCookie(stateKey);

    const myObj = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    };

    const myJSON = querystring.stringify(myObj);

    const fetchResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: myJSON,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const resJson = await fetchResponse.json();
    // thisToken = resJson.access_token;

    console.log(resJson);
  }
}

export { spotifyLogin, callBack };
