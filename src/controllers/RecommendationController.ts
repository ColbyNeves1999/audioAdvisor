import { Request, Response } from 'express';
import { getSongRecommendationByDecade } from '../models/RecommendationModel';

async function recommendationPage(req: Request, res: Response): Promise<void> {

    if (!req.session.isLoggedIn) {

        res.redirect(`/login`);

    }

    res.render('RecommendPage');

}

async function recommendSongByDecade(req: Request, res: Response): Promise<void> {
    const { year } = req.body as recommendationYear;

    console.log(year);

    const thisYear = parseInt(year);

    console.log(await getSongRecommendationByDecade(thisYear));

}

export { recommendationPage, recommendSongByDecade };