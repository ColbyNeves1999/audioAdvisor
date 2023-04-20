import { Request, Response } from 'express';
import { getGamesPlayed, updateGamesWon, updateGamesPlayed, getUserById, getGamesWon } from '../models/GameModel';
import { getSongDatabaseSize, getRandomInt } from '../models/SongModel';
import { AppDataSource } from '../dataSource';
import { Song } from '../entities/Song';

const songRepository = AppDataSource.getRepository(Song);

//Retrieves the user's number of games played
async function getNumGamesPlayed(req: Request, res: Response): Promise<void> {
  const { gamesPlayed } = req.body as NewGamesPlayedRequestBody;

  const numGames = await getGamesPlayed(gamesPlayed);

  if (!numGames) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Ok
}

//Retrieves the user's number of games won
async function getNumGamesWon(req: Request, res: Response): Promise<void> {
  const { gamesWon } = req.body as NewGamesWonRequestBody;

  const numGames = await getGamesWon(gamesWon);

  if (!numGames) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Ok
}

//Retrieves a list of URLs for the game
async function getSongUrlsForGame(req: Request, res: Response): Promise<void> {

  const databaseSize = getSongDatabaseSize();
  let urlArray = new Array(10);

  for(let i = 0; i < 10; i++){

    urlArray[i] = new Array(2);
    
  }

  const numArray = await getRandomInt(await databaseSize);

  //Grabs 10 random URLs based on the generated numbers
  for (let i = 0; i < 10; i++) {

    const rowValues = numArray[i];
    const results = await songRepository
      .createQueryBuilder('song')
      .where('rowid = :rowValues', { rowValues })
      .getOne();

    console.log(results);

    
    const { preview } = results as songRowData;

    //Saves song data so it's more readily available
    //Also prevents null and duplicate results
    if (!preview || urlArray.includes(preview)) {

      numArray[i] = numArray[i] + 1;
      i = i - 1;

    } else {
      urlArray[i][0] = preview;
      urlArray[i][1] = results;
    }

  }

  res.render('gamePage', { urlArray });

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

export { getNumGamesPlayed, getNumGamesWon, setNumGamesPlayed, setNumGamesWon, getSongUrlsForGame };
