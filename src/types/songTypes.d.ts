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
