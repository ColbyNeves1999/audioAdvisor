import { Request, Response } from 'express';
import {
  getSongByAlbum,
  getSongsByYear,
  getSongbyID,
  getSongbyTitle,
  getSongbyArtist,
  getSongbyGenera,
  addSong,
} from '../models/SongModel';

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

async function getSongsGenera(req: Request, res: Response): Promise<void> {
  const { genera } = req.body as NewGeneraRequestBody;

  const generaSongs = await getSongbyGenera(genera);

  if (!generaSongs) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Ok
}

async function addNewSong(req: Request, res: Response): Promise<void> {
  const { songTitle, artist, album, genera, releaseYear } = req.body as NewSongAdditionBody;

  const newSong = await addSong(songTitle, artist, album, genera, releaseYear);

  if (!newSong) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Ok
}

export {
  getAlbum,
  getSongsFromYear,
  getSong,
  getSongTitle,
  getArtistSongs,
  getSongsGenera,
  addNewSong,
};
