import { Request, Response } from 'express';
import { addSongsFromPlaylist } from '../models/PlaylistModel';

async function getSongsFromPlaylists(req: Request, res: Response): Promise<void> {

    //makes sure the user is authorized to pull from spotify
    if (!req.session.isLoggedIn || !req.session.authenticatedUser.authToken) {
        res.sendStatus(404);
        return;
    }

    const { id } = req.body as plalistSongData;
    const playlistId = id;

    let result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        method: 'GET',

        headers: {
            'Authorization': 'Bearer ' + req.session.authenticatedUser.authToken,
        }
    });

    if (!result.ok) {
        console.log(res.status);
    }

    let data = await result.json();

    let { tracks } = data as playlistTracksGroup;
    let { items, next } = tracks as playlistItems;

    await addSongsFromPlaylist(items, req.session.authenticatedUser.authToken, next);

    res.sendStatus(200);

}

export { getSongsFromPlaylists };