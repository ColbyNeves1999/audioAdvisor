import { Request, Response } from 'express';
import { addSong } from '../models/SongModel';
async function getSongFromSpotify(req: Request, res: Response): Promise<void> {

    if(!req.session.authenticatedUser.authToken){
      res.sendStatus(404);
      return;
    }

    const result = await fetch('https://api.spotify.com/v1/search?q=remaster track:Doxy artist:Miles Davis&type=track&market=ES&limit=1&offset=0', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + req.session.authenticatedUser.authToken,
      }
    });

    if (!result.ok) {
      console.log(res.status);
    }
  
    //const responseBodyTest = await result.text();
    //console.log(responseBodyTest);
  
    const data = await result.json();

    const { tracks } = data as tracks;
    const { items } = tracks as SpotifySongData;
    const [{ id }] = items as [songData];
    const [{ name }] = items as [songData];
    const [{ artists }] = items as [songData];

    //console.log(items);
    console.log(id);
    console.log(name);
    console.log(artists);

    await addSong(name, id, "Miles Davis");
  
    res.sendStatus(200);
  
  }

  export { getSongFromSpotify };