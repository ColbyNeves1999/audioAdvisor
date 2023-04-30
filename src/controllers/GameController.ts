import { Request, Response } from 'express';
import {
  getGamesPlayed,
  updateGamesWon,
  updateGamesPlayed,
  getUserById,
  getGamesWon,
  updateQuestionsCorrect,
  getNumQuestionsCorrect,
  chooseSongUrlsForGame
} from '../models/GameModel';

// Retrieves the user's number of games played
async function getNumGamesPlayed(req: Request, res: Response): Promise<void> {
  const { gamesPlayed } = req.body as NewGamesPlayedRequestBody;

  const numGames = await getGamesPlayed(gamesPlayed);

  if (!numGames) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Ok
}

// Retrieves the user's number of games won
async function getNumGamesWon(req: Request, res: Response): Promise<void> {
  const { gamesWon } = req.body as NewGamesWonRequestBody;

  const numGames = await getGamesWon(gamesWon);

  if (!numGames) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Ok
}

// Retrieves a list of URLs for the game
async function getSongUrlsForGame(req: Request, res: Response): Promise<void> {
  const urlArray = await chooseSongUrlsForGame();

  req.session.urlArray = urlArray;
  req.session.questionNumber = 0;

  res.render('gamePage', { urlArray, questionNumber: req.session.questionNumber });
}

async function setNumGamesPlayed(req: Request, res: Response): Promise<void> {
  const { userId } = req.body as NewUserId;

  let userGames = await getUserById(userId);

  if (!userGames) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  // Now Update Num Games Played
  userGames = await updateGamesPlayed(userGames);

  res.json(userGames);
}

async function setNumGamesWon(req: Request, res: Response): Promise<void> {
  const { userId } = req.body as NewUserId;

  let userGames = await getUserById(userId);

  if (!userGames) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  // Now Update Num Games Won
  userGames = await updateGamesWon(userGames);

  res.json(userGames);
}

async function setNumQuestionsCorrect(req: Request, res: Response): Promise<void> {
  const { userId } = req.body as NewUserId;

  let userQuestions = await getUserById(userId);

  if (!userQuestions) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  // Now Update the Questions Correct
  userQuestions = await updateQuestionsCorrect(userQuestions);

  res.json(userQuestions);
}

async function checkAnswer(req: Request, res: Response): Promise<void> {

  req.session.questionNumber;
  const urlArray = req.session.urlArray;

  const { questionsCorrect } = req.session.authenticatedUser;

  // Now redirect to the proper question in the array
  req.session.questionNumber = req.session.questionNumber + 1;

  if (req.session.questionNumber < 10) {
    res.render('gamePage', { urlArray, questionNumber: req.session.questionNumber });
  } else {
    res.render('/results', { numQuestions: getNumQuestionsCorrect(questionsCorrect) });
  }
}

export {
  getNumGamesPlayed,
  getNumGamesWon,
  setNumGamesPlayed,
  setNumGamesWon,
  getSongUrlsForGame,
  setNumQuestionsCorrect,
  checkAnswer,
};