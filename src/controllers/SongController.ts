import { Request, Response } from 'express';
import { addSong, getSongByAlbum, getSongsByYear, getSongbyID, getSongbyTitle, getSongbyArtist, getSongbyGenre, } from '../models/SongModel';

async function getSongFromSpotify(req: Request, res: Response): Promise<void> {

  if (!req.session.authenticatedUser.authToken) {
    res.sendStatus(404);
    return;
  }

  const { songTitle, artist } = req.body as NewSongAdditionBody;

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

  console.log(data);
  const { tracks } = data as tracks;
  const { items } = tracks as SpotifySongData;
  const [{ id, artists, name, album }] = items as [songData];
  const { release_date } = album as spotSongRelease;

  let artistName = artists[0].name;

  for (let i = 1; i < artists.length; i++) {
    artistName = artistName + ", " + artists[i].name;
  }

  //This is temporary till a better solution is decided. Spotify doesn't store songs with genres
  const genre = "hello";

  await addSong(name, id, artistName, genre, release_date);

  res.sendStatus(200);

}

async function getAlbum(req: Request, res: Response): Promise<void> {
  const { album } = req.body as NewAlbumRequestBody;

  const albumName = await getSongByAlbum(album);
  if (!albumName) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  console.log(albumName);
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

export { getSongFromSpotify, getAlbum, getSongsFromYear, getSong, getSongTitle, getArtistSongs, getSongsGenre };
