import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import { registerUser, logIn } from './controllers/UserController';
import { spotifyLogin, callBack } from './controllers/SpotifyController';

const app: Express = express();
app.use(express.json());

const { PORT } = process.env;

app.post('/api/users', registerUser); // Create an account
app.post('/api/login', logIn); // Log in to an account
app.get('/api/spotifyLogin', spotifyLogin); //Logs in to and authorizes spotify access
app.get('/api/callBack', callBack);
 
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
