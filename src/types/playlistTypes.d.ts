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

///////////////////////////////////
////// Spotify song from User's Playlists
///////////////////////////////////

type userPlaylistItems = {
    items: [userPlaylistIds];

};

type userPlaylistIds = {
    id: string;
};