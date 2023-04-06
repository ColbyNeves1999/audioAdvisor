"use strict";
exports.__esModule = true;
require("./config");
require("express-async-errors");
var express_1 = require("express");
var express_session_1 = require("express-session");
var connect_sqlite3_1 = require("connect-sqlite3");
var UserController_1 = require("./controllers/UserController");
var SpotifyController_1 = require("./controllers/SpotifyController");
var SongController_1 = require("./controllers/SongController");
var app = (0, express_1["default"])();
var _a = process.env, PORT = _a.PORT, COOKIE_SECRET = _a.COOKIE_SECRET;
var SQLiteStore = (0, connect_sqlite3_1["default"])(express_session_1["default"]);
app.use((0, express_session_1["default"])({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 },
    name: 'session',
    resave: false,
    saveUninitialized: false
}));
app.use(express_1["default"].json());
app.post('/api/users', UserController_1.registerUser); // Create an account
app.post('/api/login', UserController_1.logIn); // Log in to an account
app.get('/api/spotifyLogin', SpotifyController_1.spotifyLogin); // Logs in to and authorizes spotify access
app.get('/api/callBack', SpotifyController_1.spotifyLogin);
app.get('/api/songID/:songID', SongController_1.getSong); // Gets a specific song by the songID
app.get('/api/songTitle/:songTitle', SongController_1.getSongTitle); // Gets a list of every song that might have the same name
app.get('/api/artist/:artist', SongController_1.getArtistSongs); // Gets a list of all the songs made by a specific artist
app.get('/api/album/:album', SongController_1.getAlbum); // Gets a list of all the songs on an album
app.get('/api/releaseYear/:releaseYear', SongController_1.getSongsFromYear); // Gets a list of all the songs released in a year
app.get('/api/genera/:genera', SongController_1.getSongsGenera); // Gets a list of all the songs that are the same genera
app.post('/api/addSong/songTitle/:songTitle/artist/:artist/album/:album/releaseYear/:releaseYear', SongController_1.addNewSong);
app.listen(PORT, function () {
    console.log("Listening at http://localhost:".concat(PORT));
});
