import { Request, Response } from 'express';
import {
  getGamesPlayed,
  updateGamesWon,
  updateGamesPlayed,
  getUserById,
  getGamesWon,
  updateQuestionsCorrect,
  getNumQuestionsCorrect,
} from '../models/GameModel';
import { getSongDatabaseSize, getRandomInt } from '../models/SongModel';
import { AppDataSource } from '../dataSource';
import { Song } from '../entities/Song';

const songRepository = AppDataSource.getRepository(Song);

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
  const databaseSize = getSongDatabaseSize();
  const urlArray = new Array(10);

  const numArray = await getRandomInt(await databaseSize);

  const repoSize = await songRepository.count();

  // Grabs 10 random URLs based on the generated numbers
  for (let i = 0; i < 10; i++) {
    const rowValues = numArray[i];
    const results = await songRepository
      .createQueryBuilder('song')
      .where('rowid = :rowValues', { rowValues })
      .getOne();

    // const { preview } = results as songRowData;
    let preview;
    if (results.preview) {
      preview = results.preview;
      // Saves song data so it's more readily available
      // Also prevents null and duplicate results
      if (urlArray.includes(preview)) {
        numArray[i] = numArray[i] + 1;
        if (numArray[i] > repoSize) {
          numArray[i] = 1;
        }
        i -= 1;
      } else {
        urlArray[i] = results;
      }
    } else {
      numArray[i] = numArray[i] + 1;
      if (numArray[i] > repoSize) {
        numArray[i] = 1;
      }
      i -= 1;
    }
  }

  res.render('gamePage', { urlArray, questionNumber: 0 });
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
  const { questionNumber, functionArray } = req.body as QuestionNumberParam;
  console.log(questionNumber);
  let temp = parseInt(questionNumber);

  // console.log(functionArray);

  const { questionsCorrect } = req.session.authenticatedUser;
  console.log('hello world!');

  // const temp2 = JSON.parse(functionArray);
  // console.log(functionArray);

  // Now redirect to the proper question in the array
  temp += 1;
  console.log(temp);
  console.log('look here');
  if (temp < 10) {
    res.render(`/gamePage`, { temp, functionArray });
    // res.render('gamePage', { urlArray, questionNumber: 0 });
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
