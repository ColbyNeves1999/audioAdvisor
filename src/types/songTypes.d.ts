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

type spotArtGenre = {
  genres: [string];
};

type spotArtName = {
  name: string;
  id: string;
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
  preview_url: string;
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
  id: string;
};

type spotSongReleaseByID = {
  release_date: string;
  name: string;
  genres: [string];
};

type songDataByID = {
  artists: [spotArtNameByID];
  id: string;
  name: string;
  album: spotSongReleaseByID;
  preview_url: string;
};

type SpotifySongDataByID = {
  items: songData;
  limit: number;
};

type tracksByID = {
  tracks: SpotifySongDataByID;
};

///////////////////////////////////
////// Database Information
///////////////////////////////////

type myRow = {
  Song: songRowData
};

type songRowData = {
  preview: string;
  songID: string;
};

