import { Request, Response } from 'express';

function songAddPage(req:Request, res: Response) {
    res.render("songAdditionPage");
};

export {songAddPage};