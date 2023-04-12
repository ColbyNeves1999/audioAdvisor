type playlistTracksGroup = {
    tracks: playlistItems;
};

type playlistItems = {
    items: [playlistTracks]
}
type playlistTracks = {
    track: plalistSongData;
};

type plalistSongData = {
    id: string;
};