import { Request, Response } from 'express';
import {
  updateGamesWon,
  getUserById,
  chooseSongUrlsForGame,
  addGameWinner,
} from '../models/GameModel';

// Retrieves a list of URLs for the game
async function getSongUrlsForGame(req: Request, res: Response): Promise<void> {

  if (!req.session.isLoggedIn) {
    res.redirect(`/login`);
    return;
  }

  //gets a randomized array of URLs for the game
  const urlArray = await chooseSongUrlsForGame();

  //Sets user game data that can be accessed anywhere in the type/javascript side of code
  req.session.urlArray = urlArray;
  req.session.authenticatedUser.questionsCorrect = 0;
  req.session.questionNumber = 0;

  res.render('gamePage', { urlArray, questionNumber: req.session.questionNumber });
}

async function checkAnswer(req: Request, res: Response): Promise<void> {

  //String sent to result page indicating win/loss status of the game
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
    //Just repeats the game if they haven't gotten past 10 questions
    res.render('gamePage', { urlArray, questionNumber: req.session.questionNumber });
  } else {

    const temp = await getUserById(req.session.authenticatedUser.userId);
    //Updating user win count if they win
    if (temp && questionsCorrect >= 7) {
      await updateGamesWon(temp);
      gameStatus = "Won";
    } else if (questionsCorrect >= 7) {
      await addGameWinner(req.session.authenticatedUser.userId);
      await updateGamesWon(temp);
      gameStatus = "Won";
    }

    //results that will be sent to the results page to be shown 
    const questionsRight = req.session.authenticatedUser.questionsCorrect;
    const tempArray = req.session.urlArray;
    let questionsArray = "";

    //Creates a string of the songs being sent to the results page
    for (let i = 0; i < tempArray.length; i++) {

      questionsArray = questionsArray + tempArray[i].songTitle;
      if (i !== (tempArray.length - 1)) {
        questionsArray = questionsArray + ", ";
      }

    }

    //Makes sure the user can't carry previous game data out of the ending one
    req.session.authenticatedUser.questionsCorrect = 0;
    req.session.questionNumber = 0;
    req.session.urlArray = new Array();

    res.render('resultsPage', { questionsRight, questionsArray, gameStatus });
  }
}

export {

  getSongUrlsForGame,
  checkAnswer,

};