type NewAlbumRequestBody = {
  album: string;
};

type NewYearRequestBody = {
  releaseYear: number;
};

type NewSongRequestBody = {
  songID: string;
};

type NewSongTitleRequestBody = {
  songTitle: string;
};

type NewArtistRequestBody = {
  artist: string;
};

type NewGeneraRequestBody = {
  genera: string;
};

type NewSongAdditionBody = {
  songTitle: string;
  artist: string;
  album: string;
  genre: string;
  releaseYear: number;
};


///////////////////////////////////
////// Spotify song data
///////////////////////////////////

type spotArtName = {
  name: string;
};

type spotSongRelease = {
  release_date: string;
  name: string;
}

type songData = {
  artists: [spotArtName];
  id: string;
  name: string;
  album: spotSongRelease;
};

type SpotifySongData = {
  items: [songData];
  limit: number;
};

type tracks = {
  tracks: SpotifySongData;
};

///////////////////////////////////
////// Spotify song data by ID
///////////////////////////////////

type spotArtNameByID = {
  name: string;
};

type spotSongReleaseByID = {
  release_date: string;
  name: string;
};

type songDataByID = {
  artists: [spotArtNameByID];
  id: string;
  name: string;
  album: spotSongReleaseByID;
};

type SpotifySongDataByID = {
  items: songData;
  limit: number;
};

type tracksByID = {
  tracks: SpotifySongDataByID;
};