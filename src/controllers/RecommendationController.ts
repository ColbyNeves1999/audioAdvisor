import { Request, Response } from 'express';
import { getSongRecommendationByDecade, getSongRecommendationByGenre, getSongRecommendationByFavorite, getGenreArray, arrayToString } from '../models/RecommendationModel';
import { getUserById } from '../models/UserModel';
import { Song } from '../entities/Song';

//Redirects the user to the recommendationPage
async function recommendationPage(req: Request, res: Response): Promise<void> {

    if (!req.session.isLoggedIn) {
        res.redirect(`/login`);
        return;
    }

    //initiallizing data to be sent to the RecommendPage
    let songRecommendationByYear = "";
    let songRecommendationBySongGenre = "";
    let songRecommendationByFav = "";
    let genreArray = await getGenreArray();
    req.session.genreArray = arrayToString(genreArray);
    const myGenreArray = req.session.genreArray;
    let playableSong = new Song();

    //Used to prevent users from carrying data across pages
    req.session.authenticatedUser.questionsCorrect = 0;
    req.session.questionNumber = 0;
    req.session.urlArray = new Array();

    res.render('RecommendPage', { songRecommendationByYear, songRecommendationBySongGenre, songRecommendationByFav, myGenreArray, playableSong });

}

//Recommends songs from the decade of the year the user asks for
async function recommendSongByDecade(req: Request, res: Response): Promise<void> {

    if (!req.session.isLoggedIn) {
        res.redirect(`/login`);
        return;
    }

    const { year } = req.body as recommendationYear;

    const thisYear = parseInt(year);

    //initiallizing data to be sent to the RecommendPage
    let songRecommendationByYear = "";
    let songRecommendationBySongGenre = "";
    let songRecommendationByFav = "";
    let genreArray = await getGenreArray();
    req.session.genreArray = arrayToString(genreArray);
    const myGenreArray = req.session.genreArray;
    let temp = req.session.previousRecommendation;

    do {
        temp = await getSongRecommendationByDecade(thisYear);
    } while (!temp && temp === req.session.previousRecommendation);

    if (!temp) {
        songRecommendationByYear = "Sorry, there is not currently a song from that decade in our database. You could add your own!"
        temp = new Song();
    } else {
        songRecommendationByYear = temp.songTitle + " by " + temp.artist;
    }

    let playableSong = temp;

    //Used to limit the posibility that the user ends up with a recommendation twice
    req.session.previousRecommendation = temp;

    //Used to prevent users from carrying data across pages
    req.session.authenticatedUser.questionsCorrect = 0;
    req.session.questionNumber = 0;
    req.session.urlArray = new Array();

    res.render('RecommendPage', { songRecommendationByYear, songRecommendationBySongGenre, songRecommendationByFav, myGenreArray, playableSong });

}

//Recommends songs of a genre to the user
async function recommendSongByGenre(req: Request, res: Response): Promise<void> {

    if (!req.session.isLoggedIn) {
        res.redirect(`/login`);
        return;
    }

    const { genre } = req.body as recommendationYear;

    //initiallizing data to be sent to the RecommendPage
    let songRecommendationByYear = "";
    let songRecommendationBySongGenre = "";
    let songRecommendationByFav = "";
    let genreArray = await getGenreArray();
    req.session.genreArray = arrayToString(genreArray);
    const myGenreArray = req.session.genreArray;
    let temp = req.session.previousRecommendation;

    do {
        temp = await getSongRecommendationByGenre(genre);
    } while (!temp && temp === req.session.previousRecommendation)

    if (!temp) {
        songRecommendationBySongGenre = "Sorry, there is not currently a song of that genre in our database. You could add your own!";
        temp = new Song();
    } else {
        songRecommendationBySongGenre = temp.songTitle + " by " + temp.artist;
    }

    let playableSong = temp;

    //Used to limit the posibility that the user ends up with a recommendation twice
    req.session.previousRecommendation = temp;

    //Used to prevent users from carrying data across pages
    req.session.authenticatedUser.questionsCorrect = 0;
    req.session.questionNumber = 0;
    req.session.urlArray = new Array();

    res.render('RecommendPage', { songRecommendationByYear, songRecommendationBySongGenre, songRecommendationByFav, myGenreArray, playableSong });

}

//Recommends songs based on the prefered genre of the user
async function recommendSongByFav(req: Request, res: Response): Promise<void> {

    if (!req.session.isLoggedIn) {
        res.redirect(`/login`);
        return;
    }

    //initiallizing data to be sent to the RecommendPage
    let songRecommendationByYear = "";
    let songRecommendationBySongGenre = "";
    let songRecommendationByFav = "";
    let genreArray = await getGenreArray();
    req.session.genreArray = arrayToString(genreArray);
    const myGenreArray = req.session.genreArray;
    let temp = req.session.previousRecommendation;

    const user = await getUserById(req.session.authenticatedUser.userId);

    do {
        temp = await getSongRecommendationByFavorite(user.favoriteGenre);
    } while (!temp && temp === req.session.previousRecommendation);

    if (!temp) {
        songRecommendationByFav = "Sorry, there is not currently a song from that genre in our database. You could add your own!"
        temp = new Song();
    } else {
        songRecommendationByFav = temp.songTitle + " by " + temp.artist;
    }

    let playableSong = temp;

    //Used to limit the posibility that the user ends up with a recommendation twice
    req.session.previousRecommendation = temp;

    //Used to prevent users from carrying data across pages
    req.session.authenticatedUser.questionsCorrect = 0;
    req.session.questionNumber = 0;
    req.session.urlArray = new Array();

    res.render('RecommendPage', { songRecommendationByYear, songRecommendationBySongGenre, songRecommendationByFav, myGenreArray, playableSong });


}

export { recommendationPage, recommendSongByDecade, recommendSongByGenre, recommendSongByFav };