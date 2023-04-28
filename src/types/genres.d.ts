type genreKey = {
    key: string;
};

type genreTrack = {
    track: genreKey;
};

type grenreHits = {
    hits: [genreTrack];
};

type genreTracks = {
    tracks: grenreHits;
};