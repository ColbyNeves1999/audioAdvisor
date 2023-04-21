import { addSong } from './SongModel';

//Recieves playlist data to add songs from said playlists
async function addSongsFromPlaylist(items: [playlistTracks], authToken: string, next: string): Promise<void> {

  //Loops until there is no longer a another page of songs
  do {

    //Loops through and adds every song reported by Spotify
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

      //This is grabbing individual groupings of data from each page of songs
      const data = await songResult.json();
      let { name } = data as songDataByID;
      const { id } = data as songDataByID;
      const songName = name;
      const { artists, album, preview_url } = data as songDataByID;
      ({ name } = album as spotSongReleaseByID);
      const { release_date } = album as spotSongReleaseByID;
      const genre = "music";

      //This is creating a string that will contain all artists associated with the song
      let artistName = artists[0].name;
      for (let i = 1; i < artists.length; i++) {
        artistName = artistName + ", " + artists[i].name;
      }

      await addSong(songName, id, artistName, genre, release_date, name, preview_url);

    }

    //This section checks to make sure the next set of songs from the playlist is grabbed
    if (next !== null) {

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

  } while (next !== null)

}

//Requests a playlist's data from Spotify
async function fetchFromPlaylists(playlistId: string, userToken: string): Promise<void> {

  let result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    method: 'GET',

    headers: {
      'Authorization': 'Bearer ' + userToken,
    }
  });

  if (!result.ok) {
    return;
  }

  let data = await result.json();

  let { tracks } = data as playlistTracksGroup;
  let { items, next } = await tracks as playlistItems;

  await addSongsFromPlaylist(items, userToken, next);

}

export { addSongsFromPlaylist, fetchFromPlaylists };