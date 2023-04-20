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

  for(let i = 0; i < 10; i++){

    urlArray[i] = new Array(2);
    
  }

  const numArray = await getRandomInt(await databaseSize);

  for (let i = 0; i < 10; i++) {

    const rowValues = numArray[i];
    const results = await songRepository
      .createQueryBuilder('song')
      .where('rowid = :rowValues', { rowValues })
      .getOne();

    const { preview, songID} = results as songRowData;
    if (!preview || urlArray.includes(preview)) {

      //console.log(songID);
      //console.log(numArray[i]);
      numArray[i] = numArray[i] + 1;
      i = i - 1;

    } else {
      urlArray[i][0] = preview;
      urlArray[i][1] = songID;
    }

  }

  for(let i = 0; i < 10; i++){

    console.log("URL:", urlArray[i][0]);
    console.log("ID:", urlArray[i][1])

  }

  

  //res.sendStatus(200); // 200 Ok
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
