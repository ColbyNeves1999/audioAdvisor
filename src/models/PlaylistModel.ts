import { addSong } from './SongModel';

async function addSongsFromPlaylist(items: [playlistTracks], authToken: string, next: string): Promise<void> {

  do{

    for (let i = 0; i < items.length; i++) {

      const songResult = await fetch(`https://api.spotify.com/v1/tracks/${items[i].track.id}`, {
        method: 'GET',

        headers: {
            'Authorization': 'Bearer ' + authToken,
        }
      });

      if (!songResult.ok) {
          return;
      }

      const data = await songResult.json();
      let { name } = data as songDataByID;
      const { id } = data as songDataByID;
      const songName = name;
      const { artists, album } = data as songDataByID;
      ({ name } = album as spotSongReleaseByID);
      const { release_date } = album as spotSongReleaseByID;
      const genre = "music";

      //This is creating a string that will contain all artists associated with the song
      let artistName = artists[0].name;
      for (let i = 1; i < artists.length; i++) {
          artistName = artistName + ", " + artists[i].name;
      }

      //console.log(songName);
      await addSong(songName, id, artistName, genre, release_date, name);

    }

    //This section checks to make sure the next set of songs is grabbed.
    if(next !== null){

      let result = await fetch(next, {
        method: 'GET',

        headers: {
            'Authorization': 'Bearer ' + authToken,
        }

      });

      if (!result.ok) {
        return;
      }

      let data = await result.json();
      ({ items, next } = data as playlistTracksGroup);

    }

  }while( next !== null )
  
}

  export { addSongsFromPlaylist };