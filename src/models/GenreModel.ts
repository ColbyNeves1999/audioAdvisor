//Used to request an artist's genre from spotify
//It's not in a controller because it's called by several functions
async function getArtistGenre(id: string, authToken: string): Promise<string> {

    const result = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
        method: 'GET',

        headers: {
            'Authorization': 'Bearer ' + authToken,
        }
    });

    if (!result.ok) {
        return "null";
    }

    const data = await result.json();

    const { genres } = data as spotArtGenre;

    let songGenre;
    if (!genres) {
        songGenre = "unknown";
    } else {
        songGenre = genres[0];
    }

    return songGenre;

}

export { getArtistGenre };