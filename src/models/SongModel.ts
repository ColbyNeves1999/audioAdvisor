import { AppDataSource } from '../dataSource';
import { Song } from '../entities/Song';

const songRepository = AppDataSource.getRepository(Song);

async function addSong(songTitle: string, songId: string, artist: string, genre: string, releaseYear: string, album: string, songPreview: string): Promise<Song> {

  // Create the new song object and saves all the incoming data for it
  let newSong = new Song();
  newSong.songID = songId;
  newSong.songTitle = songTitle;
  newSong.artist = artist;
  newSong.genre = genre;
  newSong.releaseYear = releaseYear;
  newSong.album = album;
  newSong.preview = songPreview;

  // Then save it to the database
  // NOTES: We reassign to `newSong` so we can access

  const songInPlaylist = await getSongbyID(newSong.songID);

  if (!songInPlaylist) {
    console.log(newSong.songTitle);
    newSong = await songRepository.save(newSong);
  }

  return newSong;

}

async function getSongByAlbum(albumName: string): Promise<Song[]> {
  // function gets an array of every song on a specific album
  const songs = await songRepository
    .createQueryBuilder('song')
    .where('album = :albumName', { albumName })
    .select(['song.songTitle', 'song.artist', 'song.genera'])
    .getMany();

  return songs;
}

async function getSongbyGenre(genera: string): Promise<Song[]> {
  // function gets an array of every song by that genera
  const songGenera = await songRepository
    .createQueryBuilder('song')
    .where('genera = :genera', { genera })
    .select(['song.songTitle', 'song.album', 'song.artist'])
    .getMany();

  return songGenera;
}

async function getSongbyArtist(artistName: string): Promise<Song[]> {
  // function gets an array of every song this artist has
  const songArtist = await songRepository
    .createQueryBuilder('song')
    .where('artist = :artistName', { artistName })
    .select(['song.album', 'song.songTitle', 'song.genera'])
    .getMany();

  return songArtist;
}

async function getSongbyTitle(songTitle: string): Promise<Song[]> {
  // function gets an array of every song that has the same title
  const title = await songRepository
    .createQueryBuilder('song')
    .where('title = :songTitle', { songTitle })
    .select(['song.artist', 'song.album', 'song.releaseYear'])
    .getMany();

  return title;
}

async function getSongbyID(songID: string): Promise<Song | null> {
  const ID = await songRepository.findOne({ where: { songID } });
  return ID;
}

async function getSongsByYear(releaseDate: number): Promise<Song[]> {
  // function gets an array of every song that was released in a specific year
  const songs = await songRepository
    .createQueryBuilder('song')
    .where('releaseYear = :releaseDate', { releaseDate })
    .select(['song.songTitle', 'song.artist', 'song.album', 'song.genera'])
    .getMany();

  return songs;
}

async function getSongDatabaseSize(): Promise<number | null> {

  const songSize = await songRepository.count();

  return songSize;
}

//A function intended to be used with the audioAdvisor game
function getRandomInt(max: number): number[] {

  //Fills the array(10) with -1 to make sure no unintentional matches happen
  let numArray = new Array(10).fill(-1);

  //The list is maxing out at 10
  for (let i = 0; i < 10; i++) {

    let numTemp = Math.floor(Math.random() * max);

    while (numArray.includes(numTemp)) {

      numTemp = Math.floor(Math.random() * max);

    }

    numArray[i] = numTemp;

  }

  return numArray;
}

async function getSongs(): Promise<Song[]> {
  // function gets an array of all the songs in the database
  return await songRepository.find();
}

export { addSong, getSongByAlbum, getSongbyGenre, getSongbyArtist, getSongbyTitle, getSongsByYear, getSongbyID, getSongDatabaseSize, getRandomInt, getSongs };
