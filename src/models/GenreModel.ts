async function getArtistGenre(id: string, authToken: string): Promise<string>{
    
    const result = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
    method: 'GET',

    headers: {
        'Authorization': 'Bearer ' + authToken,
      }
    });

    if (!result.ok) {
        return "no";
    }

    const data = await result.json();

    const { genres } = data as spotArtGenre;

    let songGenre;
    if(!genres){
        songGenre = "unknown";
    }else{
        songGenre = genres[0];
    }

    return songGenre;

}

export {getArtistGenre};