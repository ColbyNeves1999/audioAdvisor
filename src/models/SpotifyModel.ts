import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

function generateRandomString(length: number) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

async function refreshAuth(authCode: string, email: string): Promise<void> {
  let thisUser = await userRepository.findOne({ where: { email } }) as User;
  thisUser.spotifyAuth = authCode;

  thisUser = await userRepository.save(thisUser);
}

async function storeAuth(authCode: string, refreshCode: string, email: string): Promise<void> {
  let thisUser = await userRepository.findOne({ where: { email } }) as User;
  thisUser.spotifyAuth = authCode;
  thisUser.refreshAuth = refreshCode;

  thisUser = await userRepository.save(thisUser);
}

export { generateRandomString, refreshAuth, storeAuth };