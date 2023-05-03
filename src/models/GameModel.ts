import { AppDataSource } from '../dataSource';
import { GameWinner } from '../entities/GameWinner';
import { Song } from '../entities/Song';
import { getSongDatabaseSize, getRandomInt } from './SongModel';

const gameRepository = AppDataSource.getRepository(GameWinner);
const songRepository = AppDataSource.getRepository(Song);

//Gets how many games the current player has won
async function getGamesWon(playerId: string): Promise<GameWinner | null> {
  const wins = await gameRepository
    .createQueryBuilder('game')
    .where('userID = :playerId', { playerId })
    .getOne();
  return wins;
}

//Updates the number of games the user has won
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

//Gets the user by ID
async function getUserById(userID: string): Promise<GameWinner | null> {
  const user = await gameRepository.findOne({ where: { userID } });
  return user;
}

//Updates the user's correct questions for the game
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

//gets the number of games correct
async function getNumQuestionsCorrect(questionsCorrect: number): Promise<GameWinner | null> {
  const wins = await gameRepository.findOne({ where: { questionsCorrect } });
  return wins;
}

//creates an array of 10 randomly chosen songs from the database
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

    //Makes sure no songs without previews and duplicates are added
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

//Adds a game winner to the database
async function addGameWinner(userID: string): Promise<GameWinner> {
  let newGameWinner = new GameWinner();
  newGameWinner.userID = userID;
  newGameWinner = await gameRepository.save(newGameWinner);
  return newGameWinner;
}

export {

  getGamesWon,
  updateGamesWon,
  getUserById,
  updateQuestionsCorrect,
  getNumQuestionsCorrect,
  chooseSongUrlsForGame,
  addGameWinner,
};