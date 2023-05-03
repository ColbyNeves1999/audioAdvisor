import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';
import { encrypt } from '../utils/encrypt';

const userRepository = AppDataSource.getRepository(User);

//Random string generated 
function generateRandomString(length: number) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

//Helps with the refreshing of the encrypted spotify authorization code
async function refreshAuth(authCode: string, email: string): Promise<string> {
  let thisUser = await userRepository.findOne({ where: { email } }) as User;
  thisUser.spotifyAuth = encrypt(authCode);

  thisUser = await userRepository.save(thisUser);
  return thisUser.spotifyAuth;
}

//Helps with storing of the encryoted Spotify authorization code
async function storeAuth(authCode: string, refreshCode: string, email: string): Promise<void> {
  let thisUser = await userRepository.findOne({ where: { email } }) as User;
  thisUser.spotifyAuth = encrypt(authCode);
  thisUser.refreshAuth = encrypt(refreshCode);

  thisUser = await userRepository.save(thisUser);
}

export { generateRandomString, refreshAuth, storeAuth };