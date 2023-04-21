import { Request, Response } from 'express';
import { addSongsFromPlaylist, fetchFromPlaylists } from '../models/PlaylistModel';

async function getSongsFromPlaylists(req: Request, res: Response): Promise<void> {

    //makes sure the user is authorized to pull from spotify
    if (!req.session.isLoggedIn || !req.session.authenticatedUser.authToken) {
        res.sendStatus(404);
        return;
    }

    const { id } = req.body as plalistSongData;
    const playlistId = id;

    //Allows for a specific playlist to be added
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
    //next is the page consisting of the next ~100 songs  after the first 100 of a playlist
    let { items, next } = tracks as playlistItems;

    await addSongsFromPlaylist(items, req.session.authenticatedUser.authToken, next);

    res.sendStatus(200);

}

//Grabs the playlists a user has off of their authorized spotify account
async function getUsersSpotifyPlaylists(req: Request, res: Response): Promise<void> {

    if (!req.session.isLoggedIn || !req.session.authenticatedUser.authToken) {
        res.sendStatus(404);
        return;
    }

    const userId = await req.session.authenticatedUser.spotifyId;
    console.log(userId);
    //Spotify only allows 50 playlists requested per fetch
    let result = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists?&limit=50&offset=0`, {
        method: 'GET',

        headers: {
            'Authorization': 'Bearer ' + req.session.authenticatedUser.authToken,
        }
    });

    if (!result.ok) {
        console.log(res.status);
    }

    let data = await result.json();

    const { items } = data as userPlaylistItems;

    //Sending each playlist song's ID to be searched
    for (let i = 0; i < items.length; i++) {

        fetchFromPlaylists(items[i].id, req.session.authenticatedUser.authToken);

    }

    res.sendStatus(200);

}

export { getSongsFromPlaylists, getUsersSpotifyPlaylists };