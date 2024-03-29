import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

//Adds a user to the database
async function addUser(email: string, passwordHash: string): Promise<User> {

  // Create the new user object and saves data
  let newUser = new User();
  newUser.email = email;
  newUser.passwordHash = passwordHash;

  // Then save it to the database
  // NOTES: We reassign to `newUser` so we can access
  // NOTES: the fields the database autogenerates (the id & default columns)
  newUser = await userRepository.save(newUser);

  return newUser;

}

//Helps stored the recieved Spotify ID
async function setUserSpotId(userId: string, spotId: string): Promise<void> {

  let user = await getUserById(userId);
  user.spotifyId = spotId;

  user = await userRepository.save(user);

}

async function setUserGenre(userId: string, genre: string): Promise<void> {

  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ favoriteGenre: genre })
    .where({ userId })
    .execute();

}

async function getUserByEmail(email: string): Promise<User | null> {
  return userRepository.findOne({ where: { email } });
}

async function allUserData(): Promise<User[]> {
  return await userRepository.find();
}

async function getUserById(userId: string): Promise<User | null> {
  return await userRepository.findOne({ where: { userId } });
}

async function getUsersByViews(minViews: number): Promise<User[]> {

  const users = await userRepository
    .createQueryBuilder('user')
    .where('profileViews >= :minViews', { minViews }) // NOTES: the parameter `:minViews` must match the key name `minViews`
    .select(['user.email', 'user.profileViews', 'user.joinedOn', 'user.userId'])
    .getMany();

  return users;

}

async function incrementProfileViews(userData: User): Promise<User> {

  const updatedUser = userData;
  updatedUser.profileViews += 1;

  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ profileViews: updatedUser.profileViews })
    .where({ userId: updatedUser.userId })
    .execute();

  return updatedUser;

}

async function resetAllProfileViews(): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ profileViews: 0 })
    .where('verifiedEmail <> true')
    .execute();
}

async function updateEmailAddress(userId: string, newEmail: string): Promise<void> {

  const user = await getUserById(userId);
  user.email = newEmail;

  await userRepository.save(user);

}


export { addUser, getUserByEmail, getUserById, getUsersByViews, setUserSpotId, allUserData, incrementProfileViews, resetAllProfileViews, updateEmailAddress, setUserGenre };