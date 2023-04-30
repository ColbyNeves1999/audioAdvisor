import { Request, Response } from 'express';
import { addSong, getSongByAlbum, getSongsByYear, getSongbyID, getSongbyTitle, getSongbyArtist, getSongbyGenre, getSongs } from '../models/SongModel';
import { getArtistGenre } from '../models/GenreModel';
import { getUserByEmail } from '../models/UserModel';
import { decrypt } from '../utils/encrypt';

//Gets a song from spotify based on it's title and artist(s)
async function getSongFromSpotify(req: Request, res: Response): Promise<void> {

  if (!req.session.isLoggedIn || !req.session.authenticatedUser.authToken) {
    res.redirect(`/login`);
  }

  const tempUser = await getUserByEmail(req.session.authenticatedUser.email);

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

  const artId = artists[0].id;
  const genre = await getArtistGenre(artId, req.session.authenticatedUser.authToken);

  //This is creating a string that will contain all artists associated with the song
  let artistName = artists[0].name;
  for (let i = 1; i < artists.length; i++) {
    artistName = artistName + ", " + artists[i].name;
  }

  //This is temporary till a better solution is decided. 
  //Spotify doesn't store songs with genres

  await addSong(songName, id, artistName, genre, release_date, name, preview_url);

  //res.sendStatus(200);
  res.render('songAdditionPage');

}

//Gets a song from spotify based on it's song ID
async function getSongFromSpotifyById(req: Request, res: Response): Promise<void> {

  if (!req.session.isLoggedIn || !req.session.authenticatedUser.authToken) {
    res.redirect(`/login`);
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

//Get Song by Information
async function getAlbum(req: Request, res: Response): Promise<void> {
  const { album } = req.body as NewAlbumRequestBody;

  const albumName = await getSongByAlbum(album);
  if (!albumName) {
    res.sendStatus(404); // 404 Not Found
    return;
  }
  res.sendStatus(200); // 200 OK
}

async function getSongsFromYear(req: Request, res: Response): Promise<void> {
  const { releaseYear } = req.body as NewYearRequestBody;

  const yearReleased = await getSongsByYear(releaseYear);

  if (!yearReleased) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Ok
}

async function getSong(req: Request, res: Response): Promise<void> {
  const { songID } = req.body as NewSongRequestBody;

  const songId = await getSongbyID(songID);

  if (!songId) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Ok
}

async function getSongTitle(req: Request, res: Response): Promise<void> {
  const { songTitle } = req.body as NewSongTitleRequestBody;

  const title = await getSongbyTitle(songTitle);

  if (!title) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Ok
}

async function getArtistSongs(req: Request, res: Response): Promise<void> {
  const { artist } = req.body as NewArtistRequestBody;

  const artistSongs = await getSongbyArtist(artist);

  if (!artistSongs) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Ok
}

async function getSongsGenre(req: Request, res: Response): Promise<void> {
  const { genera } = req.body as NewGeneraRequestBody;

  const generaSongs = await getSongbyGenre(genera);

  if (!generaSongs) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Ok
}

async function getAllSongs(req: Request, res: Response): Promise<void> {
  // Don't send back the raw data. Instead render it with EJS

  const song = await getSongs();
  //songPage is where you're displaying all the songs
  res.render('songPage', { song });
  //res.sendStatus(200);
  //return;
}

export { getSongFromSpotify, getAlbum, getSongsFromYear, getSong, getSongTitle, getArtistSongs, getSongsGenre, getSongFromSpotifyById, getAllSongs };
