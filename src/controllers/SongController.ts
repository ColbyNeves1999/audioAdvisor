import { Request, Response } from 'express';

async function getSongFromSpotify(req: Request, res: Response): Promise<void> {

    if(!req.session.authenticatedUser.authToken){
      res.sendStatus(404);
      return;
    }
    
    /*JSON.stringify({
        q: "remaster track:Doxy artist:Miles Davis",
        type: "track",
        market: "ES",
        limit: 1,
        offset: 0
      });
    */
    

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
  
    console.log(data);

    const { tracks } = data as SpotifySongData;

    const { limit } = tracks as tracks;
  
    console.log(limit);

    //await setUserSpotId(req.session.authenticatedUser.userId, id);
  
    res.sendStatus(200);
  
  }

  export { getSongFromSpotify };