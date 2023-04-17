import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { registerUser, logIn, getSpotifyId } from './controllers/UserController';
import { spotifyLogin, callBack, refreshToken } from './controllers/SpotifyController';
import { getSongFromSpotify, getSongFromSpotifyById } from './controllers/SongController';
import { getSongsFromPlaylists, getUsersSpotifyPlaylists } from './controllers/PlaylistController';
import { getSongUrlsForGame } from './controllers/GameController';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public', { extensions: ['html'] }));
app.set('view engine', 'ejs');

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
app.get('/api/spotifyLogin', spotifyLogin); // Logs in to and authorizes spotify access
app.get('/api/callBack', callBack);
app.get('/api/refreshToken', refreshToken);
app.get('/api/spotifyId', getSpotifyId);
app.get('/api/getSong', getSongFromSpotify);
app.get('/api/songBySpotId', getSongFromSpotifyById);
app.get('/api/Playlists', getSongsFromPlaylists);
app.get('/api/usersPlaylists', getUsersSpotifyPlaylists);
app.get('/api/getDatabaseSongs', getSongUrlsForGame);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
