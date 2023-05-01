import { Request, Response } from 'express';
import {
  getGamesPlayed,
  updateGamesWon,
  updateGamesPlayed,
  getUserById,
  getGamesWon,
  updateQuestionsCorrect,
  chooseSongUrlsForGame,
  addGameWinner,
} from '../models/GameModel';
import { getRandomInt } from '../models/SongModel';
// import { AppDataSource } from '../dataSource';
// import { GameWinner } from '../entities/GameWinner';

// const GameWinnerRepository = AppDataSource.getRepository(GameWinner);

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

  // console.log(urlArray);
  req.session.urlArray = urlArray;
  console.log(req.session.urlArray);

  req.session.authenticatedUser.questionsCorrect = 0;
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
  // const { questionNumber, functionArray } = req.body as QuestionNumberParam;
  // console.log(questionNumber);
  // let temp = parseInt(questionNumber);
  const { updateQuestion } = req.body as QuestionNumberParam;

  if (updateQuestion === '1') {
    req.session.authenticatedUser.questionsCorrect += 1;
  }
  console.log(req.session.authenticatedUser.questionsCorrect);

  // const urlArray = await chooseSongUrlsForGame();
  const { urlArray } = req.session;

  const { questionsCorrect } = req.session.authenticatedUser;
  // console.log('hello world!');

  // Now redirect to the proper question in the array
  req.session.questionNumber = req.session.questionNumber + 1;
  // console.log(temp);
  // console.log('look here');
  if (req.session.questionNumber < 10) {
    // res.render(`/gamePage`, { urlArray, temp });
    res.render('gamePage', { urlArray, questionNumber: req.session.questionNumber });
  } else {
    const temp = await getUserById(req.session.authenticatedUser.userId);
    if (temp && questionsCorrect > 1) {
      updateGamesWon(temp);
    } else if (questionsCorrect > 1) {
      await addGameWinner(req.session.authenticatedUser.userId);
      updateGamesWon(temp);
    }
    const questionsRight = req.session.authenticatedUser.questionsCorrect;
    res.render('resultsPage', { questionsRight });
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
  getRandomInt,
};