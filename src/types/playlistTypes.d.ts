type playlistTracksGroup = {
    tracks: playlistItems;
    items: [playlistTracks];
    next: string;
};

type playlistItems = {
    items: [playlistTracks];
    total: number;
    next: string;
}
type playlistTracks = {
    track: plalistSongData;
};

type plalistSongData = {
    id: string;
};