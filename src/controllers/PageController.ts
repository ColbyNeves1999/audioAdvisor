import { Request, Response } from 'express';

function songAddPage(req:Request, res: Response) {

    if (!req.session.isLoggedIn || !req.session.authenticatedUser.authToken) {
        res.redirect(`/index`);
    }

    req.session.authenticatedUser.questionsCorrect = 0;
    req.session.questionNumber = 0;
    req.session.urlArray = new Array();
    res.render("songAdditionPage");
};

export {songAddPage};