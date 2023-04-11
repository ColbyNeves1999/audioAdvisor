/*import { AppDataSource } from '../dataSource';
import { Song } from '../entities/Song';

const songRepository = AppDataSource.getRepository(Song);

async function addSongsFromPlaylist(songIds: string): Promise<Song> {

    // Create the new user object
    let newSong = new Song();

    // Then save it to the database
    // NOTES: We reassign to `newUser` so we can access
    // NOTES: the fields the database autogenerates (the id & default columns)
    newSong = await songRepository.save(newSong);
  
    return newSong;
  
  }*/