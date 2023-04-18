import { Request, Response } from 'express';
import { getGamesPlayed, updateGamesWon, updateGamesPlayed, getUserById, getGamesWon } from '../models/GameModel';
import { getSongDatabaseSize, getRandomInt } from '../models/SongModel';
import { AppDataSource } from '../dataSource';
import { Song } from '../entities/Song';

const songRepository = AppDataSource.getRepository(Song);

async function getNumGamesPlayed(req: Request, res: Response): Promise<void> {
  const { gamesPlayed } = req.body as NewGamesPlayedRequestBody;

  const numGames = await getGamesPlayed(gamesPlayed);

  if (!numGames) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Ok
}

async function getNumGamesWon(req: Request, res: Response): Promise<void> {
  const { gamesWon } = req.body as NewGamesWonRequestBody;

  const numGames = await getGamesWon(gamesWon);

  if (!numGames) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  res.sendStatus(200); // 200 Ok
}

async function getSongUrlsForGame(req: Request, res: Response): Promise<void> {

  const databaseSize = getSongDatabaseSize();
  let urlArray = new Array(10);

  const numArray = await getRandomInt(await databaseSize);

  for (let i = 0; i < 10; i++) {

    const crumb = numArray[i];
    const test = await songRepository
      .createQueryBuilder('song')
      .where('rowid = :crumb', { crumb })
      .getOne();

    const { preview } = test as songRowData;
    if (!preview || urlArray.includes(preview)) {

      console.log(numArray[i]);
      numArray[i] = numArray[i] + 1;
      i = i - 1;

    } else {
      urlArray[i] = preview;
    }

  }

  console.log("I AM HERE");
  for (let i = 0; i < 10; i++) {

    console.log(urlArray[i]);

  }

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
