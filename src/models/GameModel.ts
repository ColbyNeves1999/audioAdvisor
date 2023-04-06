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

export { getGamesPlayed, getGamesWon, updateGamesPlayed, updateGamesWon, getUserById };
