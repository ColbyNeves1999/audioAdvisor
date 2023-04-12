import { Request, Response } from 'express';
import { addSong } from '../models/SongModel';

async function getSongsFromPlaylists(req: Request, res: Response): Promise<void> {

    if (!req.session.authenticatedUser.authToken) {
        res.sendStatus(404);
        return;
    }

    let { id } = req.body as plalistSongData;

    const result = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
        method: 'GET',

        headers: {
            'Authorization': 'Bearer ' + req.session.authenticatedUser.authToken,
        }
    });

    if (!result.ok) {
        console.log(res.status);
    }

    let data = await result.json();

    const { tracks } = data as playlistTracksGroup;
    const { items } = tracks as playlistItems;

    for (let i = 0; i < items.length; i++) {

        const songResult = await fetch(`https://api.spotify.com/v1/tracks/${items[i].track.id}`, {
            method: 'GET',

            headers: {
                'Authorization': 'Bearer ' + req.session.authenticatedUser.authToken,
            }
        });

        if (!result.ok) {
            console.log(res.status);
        }

        data = await songResult.json();
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

        await addSong(songName, id, artistName, genre, release_date, name);

    }

    res.sendStatus(200);

}

export { getSongsFromPlaylists };