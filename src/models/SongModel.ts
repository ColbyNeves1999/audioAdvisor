import { AppDataSource } from '../dataSource';
import { Song } from '../entities/Song';

const songRepository = AppDataSource.getRepository(Song);

async function addSong(
  songTitle: string,
  artist: string,
  album: string,
  genera: string
): Promise<Song> {
  // Create the new song to be added
  let newSong = new Song();
  newSong.songTitle = songTitle;
  newSong.artist = artist;
  newSong.album = album;
  newSong.genera = genera;

  // Then save it to the data base
  newSong = await songRepository.save(newSong);

  return newSong;
}

async function getSongByAlbum(album: string): Promise<Song | null> {
  const albumName = await songRepository.findOne({ where: { album } });
  return albumName;
}

async function getSongbyGenera(genera: string): Promise<Song | null> {
  const songGenera = await songRepository.findOne({ where: { genera } });
  return songGenera;
}

async function getSongbyArtist(artist: string): Promise<Song | null> {
  const songArtist = await songRepository.findOne({ where: { artist } });
  return songArtist;
}

async function getSongbyTitle(songTitle: string): Promise<Song | null> {
  const title = await songRepository.findOne({ where: { songTitle } });
  return title;
}

async function getSongbyID(songID: string): Promise<Song | null> {
  const ID = await songRepository.findOne({ where: { songID } });
  return ID;
}

async function getSongsByYear(releaseDate: number): Promise<Song[]> {
  const songs = await songRepository
    .createQueryBuilder('song')
    .where('releaseYear = :releaseDate', { releaseDate })
    .select(['song.songTitle', 'song.artist', 'song.album', 'song.genera'])
    .getMany();

  return songs;
}

export {
  addSong,
  getSongByAlbum,
  getSongbyGenera,
  getSongbyArtist,
  getSongbyTitle,
  getSongsByYear,
  getSongbyID,
};
