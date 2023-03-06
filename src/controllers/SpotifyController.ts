import { Request, Response } from 'express';
import querystring from 'querystring';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
var stateKey = 'spotify_auth_state';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

function generateRandomString(length: number) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

//Spotify login
function spotifyLogin(req: Request, res: Response): void {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';

  var myObj = {
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state
  }

  var myJSON = querystring.stringify(myObj);

  res.redirect(`https://accounts.spotify.com/authorize?` + myJSON);
                

};

async function callBack(req:Request, res:Response): Promise<void> {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  //var storedState = req.cookies ? req.cookies[stateKey] : null;
  var thisToken = null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);

    var myObj = {
      grant_type: 'authorization_code',
      //code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    }
  
    var myJSON = querystring.stringify(myObj);
    myJSON = myJSON + code;

    /*var authorizationInformation = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      },
      json: true
    };*/

    /*fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: myJSON,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
      }).then(r => r.json())
        .then(r => {
          console.log(r.access_token)
        })*/

    }
    
    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(r => r.json())
      .then(r => {
        //console.log(r.access_token)
        thisToken = r.access_token;
      })

      console.log(thisToken);

};

export { spotifyLogin, callBack };