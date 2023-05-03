import { Request, Response } from 'express';
import { addSong, getSongsByYear, getSongs } from '../models/SongModel';
import { getArtistGenre } from '../models/GenreModel';
import { getUserByEmail } from '../models/UserModel';
import { decrypt } from '../utils/encrypt';

//Gets a song from spotify based on it's title and artist(s)
async function getSongFromSpotify(req: Request, res: Response): Promise<void> {

  if (!req.session.isLoggedIn) {
    res.redirect(`/login`);
    return;
  }

  const tempUser = await getUserByEmail(req.session.authenticatedUser.email);

  //User's authorization token is encrypted so it needs to be decrypted
  if (decrypt(tempUser.spotifyAuth) !== req.session.authenticatedUser.authToken) {

    req.session.authenticatedUser.authToken = decrypt(tempUser.spotifyAuth);

  }

  const { songTitle, artist } = req.body as NewSongAdditionBody;

  //Requests spotify for a song using a song title and the artist
  const result = await fetch(`https://api.spotify.com/v1/search?q=track:${songTitle}%20artist:${artist}&type=track&market=ES&limit=1&offset=0`, {
    method: 'GET',

    headers: {
      'Authorization': 'Bearer ' + req.session.authenticatedUser.authToken,
    }
  });

  if (!result.ok) {
    console.log(res.status);
  }

  const data = await result.json();

  //Breaking down information for song to be added to database
  const { tracks } = data as tracks;
  const { items } = tracks as SpotifySongData;
  let [{ name }] = items as [songData];
  const songName = name;
  const [{ id, artists, album, preview_url }] = items as [songData];
  ({ name } = album as spotSongRelease);
  const { release_date } = album as spotSongRelease;

  //Has to use artist genre for song genre
  const artId = artists[0].id;
  const genre = await getArtistGenre(artId, req.session.authenticatedUser.authToken);

  //This is creating a string that will contain all artists associated with the song
  let artistName = artists[0].name;
  for (let i = 1; i < artists.length; i++) {
    artistName = artistName + ", " + artists[i].name;
  }

  await addSong(songName, id, artistName, genre, release_date, name, preview_url);

  //Used to prevent users from carrying data across pages
  req.session.authenticatedUser.questionsCorrect = 0;
  req.session.questionNumber = 0;
  req.session.urlArray = new Array();

  res.render('songAdditionPage');

}

//Gets a song from spotify based on it's song ID
async function getSongFromSpotifyById(req: Request, res: Response): Promise<void> {

  if (!req.session.isLoggedIn) {
    res.redirect(`/login`);
    return;
  }

  const tempUser = await getUserByEmail(req.session.authenticatedUser.email);

  if (decrypt(tempUser.spotifyAuth) !== req.session.authenticatedUser.authToken) {

    req.session.authenticatedUser.authToken = decrypt(tempUser.spotifyAuth);

  }

  const { id } = req.body as songDataByID;

  //Requests spotify for a song using an ID
  const result = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    method: 'GET',

    headers: {
      'Authorization': 'Bearer ' + req.session.authenticatedUser.authToken,
    }
  });

  if (!result.ok) {
    console.log(res.status);
  }

  //Breaking down information for song to be added to database
  const data = await result.json();
  let { name } = data as songDataByID;
  const songName = name;
  const { artists, album, preview_url } = data as songDataByID;
  ({ name } = album as spotSongReleaseByID);
  const { release_date } = album as spotSongReleaseByID;

  //Has to use artist genre for song genre
  const artId = artists[0].id;
  const genre = await getArtistGenre(artId, req.session.authenticatedUser.authToken);

  //This is creating a string that will contain all artists associated with the song
  let artistName = artists[0].name;
  for (let i = 1; i < artists.length; i++) {
    artistName = artistName + ", " + artists[i].name;
  }

  await addSong(songName, id, artistName, genre, release_date, name, preview_url);

  res.sendStatus(200);

}

//Gets a song based on the year the user asks for
async function getSongsFromYear(req: Request, res: Response): Promise<void> {
  const { releaseYear } = req.body as NewYearRequestBody;

  const yearReleased = await getSongsByYear(releaseYear);

  if (!yearReleased) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Ok
}

//Gets all the songs from the database
async function getAllSongs(req: Request, res: Response): Promise<void> {

  const song = await getSongs();

  //Used to prevent users from carrying data across pages
  req.session.authenticatedUser.questionsCorrect = 0;
  req.session.questionNumber = 0;
  req.session.urlArray = new Array();

  res.render('songPage', { song });

}

export { getSongFromSpotify, getSongsFromYear, getSongFromSpotifyById, getAllSongs };
