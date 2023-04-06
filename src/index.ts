import './config';
import 'express-async-errors';
import express, { Express } from 'express';

import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';

import { registerUser, logIn, updateUserEmail, getUserByEmail } from './controllers/UserController';
import { spotifyLogin } from './controllers/SpotifyController';
import {
  getAlbum,
  getSongsFromYear,
  getSong,
  getSongTitle,
  getArtistSongs,
  getSongsGenera,
  addNewSong,
} from './controllers/SongController';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

app.post('/api/users', registerUser); // Create an account
app.post('/api/login', logIn); // Log in to an account
app.get('/api/users/email/:email', getUserByEmail); // Gets the users account by email
app.post('/api/email', updateUserEmail); // Updates the accounts email
app.get('/api/spotifyLogin', spotifyLogin); // Logs in to and authorizes spotify access
app.get('/api/callBack', spotifyLogin);

app.get('/api/songID/:songID', getSong); // Gets a specific song by the songID
app.get('/api/songTitle/:songTitle', getSongTitle); // Gets a list of every song that might have the same name
app.get('/api/artist/:artist', getArtistSongs); // Gets a list of all the songs made by a specific artist
app.get('/api/album/:album', getAlbum); // Gets a list of all the songs on an album
app.get('/api/releaseYear/:releaseYear', getSongsFromYear); // Gets a list of all the songs released in a year
app.get('/api/genera/:genera', getSongsGenera); // Gets a list of all the songs that are the same genera

app.post(
  '/api/addSong/songTitle/:songTitle/artist/:artist/album/:album/releaseYear/:releaseYear',
  addNewSong
);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
