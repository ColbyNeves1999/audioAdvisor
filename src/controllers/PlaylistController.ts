import { Request, Response } from 'express';
import { addSongsFromPlaylist, fetchFromPlaylists } from '../models/PlaylistModel';
import { getUserByEmail } from '../models/UserModel';
import { decrypt } from '../utils/encrypt';

async function getSongsFromPlaylists(req: Request, res: Response): Promise<void> {

    //makes sure the user is authorized to pull from spotify
    if (!req.session.isLoggedIn) {
        res.redirect(`/login`);
    }

    const tempUser = await getUserByEmail(req.session.authenticatedUser.email);

    if (decrypt(tempUser.spotifyAuth) !== req.session.authenticatedUser.authToken) {

        req.session.authenticatedUser.authToken = decrypt(tempUser.spotifyAuth);

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

    req.session.authenticatedUser.questionsCorrect = 0;
    req.session.questionNumber = 0;
    req.session.urlArray = new Array();

    res.render('songAdditionPage');

}

//Grabs the playlists a user has off of their authorized spotify account
async function getUsersSpotifyPlaylists(req: Request, res: Response): Promise<void> {

    if (!req.session.isLoggedIn) {
        res.redirect(`/login`);
    }

    const tempUser = await getUserByEmail(req.session.authenticatedUser.email);

    if (decrypt(tempUser.spotifyAuth) !== req.session.authenticatedUser.authToken) {

        req.session.authenticatedUser.authToken = decrypt(tempUser.spotifyAuth);

    }

    const userId = await req.session.authenticatedUser.spotifyId;

    var thisScope = {

        scope: 'playlist-read-private user-read-collaborative'

    }

    //Spotify only allows 50 playlists requested per fetch
    let result = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists?&limit=50&offset=0&` + thisScope, {
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

        await fetchFromPlaylists(items[i].id, req.session.authenticatedUser.authToken);

    }

    req.session.authenticatedUser.questionsCorrect = 0;
    req.session.questionNumber = 0;
    req.session.urlArray = new Array();

    res.render('songAdditionPage');

}

export { getSongsFromPlaylists, getUsersSpotifyPlaylists };