import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { registerUser, logIn, getSpotifyId } from './controllers/UserController';
import { spotifyLogin, callBack, refreshToken } from './controllers/SpotifyController';

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
app.get('/api/spotifyLogin', spotifyLogin); //Logs in to and authorizes spotify access
app.get('/api/callBack', callBack);
app.get('/api/refreshToken', refreshToken);
app.get('/api/spotifyId', getSpotifyId);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
