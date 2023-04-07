import { AppDataSource } from '../dataSource';
import { Song } from '../entities/Song';

const songRepository = AppDataSource.getRepository(Song);

async function addSong(songTitle: string, songId: string, artist: string): Promise<Song> {

  // Create the new user object
  let newSong = new Song();
  newSong.songID = songId;
  newSong.songTitle = songTitle;
  newSong.artist = artist;

  // Then save it to the database
  // NOTES: We reassign to `newUser` so we can access
  // NOTES: the fields the database autogenerates (the id & default columns)
  newSong = await songRepository.save(newSong);

  return newSong;

}
// I AM MAKING A TEST CHANGE
export { addSong };