import { Request, Response } from 'express';
import { getSongRecommendationByDecade, getSongRecommendationByGenre, getGenreArray, arrayToString } from '../models/RecommendationModel';
import { Song } from '../entities/Song';

async function recommendationPage(req: Request, res: Response): Promise<void> {

    if (!req.session.isLoggedIn) {

        res.redirect(`/login`);

    }

    let songRecommendationByYear = "";
    let songRecommendationBySongGenre = "";
    let genreArray = await getGenreArray();
    req.session.genreArray = arrayToString(genreArray);
    const myGenreArray = req.session.genreArray;
    let playableSong = new Song();

    req.session.authenticatedUser.questionsCorrect = 0;
    req.session.questionNumber = 0;
    req.session.urlArray = new Array();

    res.render('RecommendPage', { songRecommendationByYear, songRecommendationBySongGenre, myGenreArray, playableSong });

}

async function recommendSongByDecade(req: Request, res: Response): Promise<void> {

    const { year } = req.body as recommendationYear;

    const thisYear = parseInt(year);

    let songRecommendationByYear = "";
    let songRecommendationBySongGenre = "";
    let genreArray = await getGenreArray();
    req.session.genreArray = arrayToString(genreArray);
    const myGenreArray = req.session.genreArray;
    let temp = req.session.previousRecommendation;

    do {
        temp = await getSongRecommendationByDecade(thisYear);
    } while (!temp && temp === req.session.previousRecommendation);

    if (!temp) {
        songRecommendationByYear = "Sorry, there is not currently a song from that decade in our database. You could add your own!"
    } else {
        songRecommendationByYear = temp.songTitle + " by " + temp.artist;
    }

    let playableSong = temp;

    req.session.previousRecommendation = temp;

    req.session.authenticatedUser.questionsCorrect = 0;
    req.session.questionNumber = 0;
    req.session.urlArray = new Array();

    res.render('RecommendPage', { songRecommendationByYear, songRecommendationBySongGenre, myGenreArray, playableSong });


}

async function recommendSongByGenre(req: Request, res: Response): Promise<void> {

    const { genre } = req.body as recommendationYear;

    let songRecommendationByYear = "";
    let songRecommendationBySongGenre = "";
    let genreArray = await getGenreArray();
    req.session.genreArray = arrayToString(genreArray);
    const myGenreArray = req.session.genreArray;
    let temp = req.session.previousRecommendation;

    do {
        temp = await getSongRecommendationByGenre(genre);
    } while (!temp && temp === req.session.previousRecommendation)

    if (!temp) {
        songRecommendationBySongGenre = "Sorry, there is not currently a song of that genre in our database. You could add your own!"
    } else {
        songRecommendationBySongGenre = temp.songTitle + " by " + temp.artist;
    }

    let playableSong = temp;

    req.session.previousRecommendation = temp;

    req.session.authenticatedUser.questionsCorrect = 0;
    req.session.questionNumber = 0;
    req.session.urlArray = new Array();

    res.render('RecommendPage', { songRecommendationByYear, songRecommendationBySongGenre, myGenreArray, playableSong });

}

export { recommendationPage, recommendSongByDecade, recommendSongByGenre };