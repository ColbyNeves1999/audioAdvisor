import { AppDataSource } from '../dataSource';
import { GameWinner } from '../entities/GameWinner';
import { Song } from '../entities/Song';
import { getSongDatabaseSize, getRandomInt } from './SongModel';

const gameRepository = AppDataSource.getRepository(GameWinner);
const songRepository = AppDataSource.getRepository(Song);

async function getGamesPlayed(gamesPlayed: number): Promise<GameWinner | null> {
  const numGames = await gameRepository.findOne({ where: { gamesPlayed } });
  return numGames;
}

async function getGamesWon(playerId: string): Promise<GameWinner | null> {
  const wins = await gameRepository
    .createQueryBuilder('game')
    .where('userID = :playerId', { playerId })
    .getOne();
  return wins;
}

async function updateGamesPlayed(gameData: GameWinner): Promise<GameWinner> {
  const updatedUser = gameData;
  updatedUser.gamesPlayed += 1;

  await gameRepository
    .createQueryBuilder()
    .update(GameWinner)
    .set({ gamesPlayed: updatedUser.gamesPlayed })
    .where({ userID: updatedUser.userID })
    .execute();

  return updatedUser;
}

async function updateGamesWon(gameData: GameWinner): Promise<GameWinner> {
  const updatedUser = gameData;
  updatedUser.gamesWon += 1;

  await gameRepository
    .createQueryBuilder()
    .update(GameWinner)
    .set({ gamesWon: updatedUser.gamesWon })
    .where({ userID: updatedUser.userID })
    .execute();

  return updatedUser;
}

async function getUserById(userID: string): Promise<GameWinner | null> {
  const user = await gameRepository.findOne({ where: { userID } });
  return user;
}

async function updateQuestionsCorrect(gameData: GameWinner): Promise<GameWinner> {
  const updatedUser = gameData;
  updatedUser.questionsCorrect += 1;

  await gameRepository
    .createQueryBuilder()
    .update(GameWinner)
    .set({ questionsCorrect: updatedUser.questionsCorrect })
    .where({ userID: updatedUser.userID })
    .execute();

  return updatedUser;
}

async function getNumQuestionsCorrect(questionsCorrect: number): Promise<GameWinner | null> {
  const wins = await gameRepository.findOne({ where: { questionsCorrect } });
  return wins;
}

async function chooseSongUrlsForGame(): Promise<Song[]> {

  const databaseSize = getSongDatabaseSize();
  const urlArray = new Array(10);

  const numArray = await getRandomInt(await databaseSize);

  const repoSize = await songRepository.count();

  // Grabs 10 random URLs based on the generated numbers
  for (let i = 0; i < 10; i++) {
    let rowValues = numArray[i];
    if (rowValues < 1) {
      rowValues = 1;
    }

    const results = await songRepository
      .createQueryBuilder('song')
      .where('rowid = :rowValues', { rowValues })
      .getOne();

    if (!urlArray.includes(results) && results.preview !== null) {
      urlArray[i] = results;
    } else {
      numArray[i] = numArray[i] + 1;
      if (numArray[i] > repoSize) {
        numArray[i] = 1;
      }
      i -= 1;
    }
  }

  return urlArray;
}

async function addGameWinner(userID: string): Promise<GameWinner> {
  let newGameWinner = new GameWinner();
  newGameWinner.userID = userID;
  newGameWinner = await gameRepository.save(newGameWinner);
  return newGameWinner;
}

export {
  getGamesPlayed,
  getGamesWon,
  updateGamesPlayed,
  updateGamesWon,
  getUserById,
  updateQuestionsCorrect,
  getNumQuestionsCorrect,
  chooseSongUrlsForGame,
  addGameWinner,
};