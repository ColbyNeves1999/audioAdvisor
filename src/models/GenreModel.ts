const getOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'shazam.p.rapidapi.com',
    },
};

async function getSongKey(songTitle: string): Promise<string> {
    const urlSafeTitle = encodeURI(songTitle);
    const searchUrl = `https://shazam.p.rapidapi.com/search?term=${urlSafeTitle}&locale=en-US&offset=0&limit=2`;

    const seachResponse = await fetch(searchUrl, getOptions);
    const { tracks } = await seachResponse.json();
    const song = tracks.hits[0].track;
    const { key } = song;
    return key;
}

async function getSongDetails(key: string): Promise<Record<string, unknown>> {
    const detailsUrl = `https://shazam.p.rapidapi.com/songs/get-details?key=${key}&l=en-US`;
    const detailsResponse = await fetch(detailsUrl, getOptions);
    const result = await detailsResponse.json();
    return result;
}

export { getSongKey, getSongDetails };