import { Request, Response } from 'express';
import {
  getGamesPlayed,
  updateGamesWon,
  updateGamesPlayed,
  getUserById,
  updateQuestionsCorrect,
  chooseSongUrlsForGame,
  addGameWinner,
} from '../models/GameModel';
import { getRandomInt } from '../models/SongModel';


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

// Retrieves a list of URLs for the game
async function getSongUrlsForGame(req: Request, res: Response): Promise<void> {
  const urlArray = await chooseSongUrlsForGame();

  if (!req.session.isLoggedIn) {
    res.redirect(`/login`);
  }

  req.session.urlArray = urlArray;

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

  let gameStatus = "Lost";

  const { updateQuestion } = req.body as QuestionNumberParam;

  if (updateQuestion === '1') {
    req.session.authenticatedUser.questionsCorrect += 1;
  }

  const { urlArray } = req.session;

  const { questionsCorrect } = req.session.authenticatedUser;

  // Now redirect to the proper question in the array
  req.session.questionNumber = req.session.questionNumber + 1;

  if (req.session.questionNumber < 10) {

    res.render('gamePage', { urlArray, questionNumber: req.session.questionNumber });
  } else {
    const temp = await getUserById(req.session.authenticatedUser.userId);
    if (temp && questionsCorrect >= 7) {
      updateGamesWon(temp);
      gameStatus = "Won";
    } else if (questionsCorrect >= 7) {
      await addGameWinner(req.session.authenticatedUser.userId);
      updateGamesWon(temp);
      gameStatus = "Won";
    }
    const questionsRight = req.session.authenticatedUser.questionsCorrect;
    const tempArray = req.session.urlArray;
    let questionsArray = "";

    for (let i = 0; i < tempArray.length; i++) {

      questionsArray = questionsArray + tempArray[i].songTitle;
      if (i !== (tempArray.length - 1)) {
        questionsArray = questionsArray + ", ";
      }

    }

    req.session.authenticatedUser.questionsCorrect = 0;
    req.session.questionNumber = 0;
    req.session.urlArray = new Array();
    res.render('resultsPage', { questionsRight, questionsArray, gameStatus });
  }
}

export {
  getNumGamesPlayed,
  setNumGamesPlayed,
  setNumGamesWon,
  getSongUrlsForGame,
  setNumQuestionsCorrect,
  checkAnswer,
  getRandomInt,
};