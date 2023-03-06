import { AppDataSource } from '../dataSource';
import { GameWinner } from '../entities/GameWinner';

const gameRepository = AppDataSource.getRepository(GameWinner);

async function getGamesPlayed(gamesPlayed: number): Promise<GameWinner | null> {
  const numGames = await gameRepository.findOne({ where: { gamesPlayed } });
  return numGames;
}

async function getGamesWon(gamesWon: number): Promise<GameWinner | null> {
  const wins = await gameRepository.findOne({ where: { gamesWon } });
  return wins;
}

async function setGamesPlayed(gamesPlayed: number): Promise<GameWinner> {
  // Create a new GameWinner object
  let numGames = new GameWinner();
  numGames.gamesPlayed = gamesPlayed;

  // Save it to the database
  numGames = await gameRepository.save(numGames);

  return numGames;
}
async function setGamesWon(gamesWon: number): Promise<GameWinner> {
  // Create a new GameWinner object
  let wins = new GameWinner();
  wins.gamesWon = gamesWon;

  // Save the object to the database
  wins = await gameRepository.save(wins);

  return wins;
}

export { getGamesPlayed, getGamesWon, setGamesPlayed, setGamesWon };
