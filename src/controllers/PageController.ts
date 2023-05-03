import { Request, Response } from 'express';
import { getUserByEmail } from '../models/UserModel';
import { getGamesWon } from '../models/GameModel';

//A seperate function use to redirect to the songAddition page
function songAddPage(req: Request, res: Response) {

    if (!req.session.isLoggedIn) {
        res.redirect(`/login`);
        return;
    }

    //Used to prevent users from carrying data across pages
    req.session.authenticatedUser.questionsCorrect = 0;
    req.session.questionNumber = 0;
    req.session.urlArray = new Array();

    res.render("songAdditionPage");
};

//A seperate function use to redirect to the songAddition page
async function userHomePageRedirect(req: Request, res: Response): Promise<void> {

    if (!req.session.isLoggedIn) {
        res.redirect(`/login`);
        return;
    }

    const user = await getUserByEmail(req.session.authenticatedUser.email);
    const userGames = await getGamesWon(user.userId);
    const gamesWon = userGames.gamesWon;

    //Used to prevent users from carrying data across pages
    req.session.authenticatedUser.questionsCorrect = 0;
    req.session.questionNumber = 0;
    req.session.urlArray = new Array();

    res.render('userHomePage', { user, gamesWon });
};

export { songAddPage, userHomePageRedirect };