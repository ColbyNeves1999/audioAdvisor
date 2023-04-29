import { decrypt } from '../utils/encrypt';
import querystring from 'querystring';
import { refreshAuth } from './SpotifyModel';
import { getUserByEmail } from './UserModel';
import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const userRepository = AppDataSource.getRepository(User);

async function refreshTokenHourly(): Promise<void> {

    const allUsers = await userRepository.find();
    const dbSize = await userRepository.count();

    for (let i = 0; i < dbSize; i++) {

        if (allUsers[i].accountAuthorized) {

            var refresh_token = decrypt(allUsers[i].refreshAuth) as string || null;

            var myObj = {
                grant_type: 'refresh_token',
                refresh_token: refresh_token,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            }

            var myJSON = querystring.stringify(myObj);

            //Queries spotify for a access token
            const fetchResponse = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                body: myJSON,
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const resJson = await fetchResponse.json();

            //Refreshes authentification code and saves it for the user.
            const { access_token } = resJson as SpotifyTokenResponse;
            await refreshAuth(access_token, allUsers[i].email);

            //Makes sure the current user gets the newest authentification code
            const user = await getUserByEmail(allUsers[i].email);
            allUsers[i].spotifyAuth = decrypt(user.spotifyAuth);

        }

    }

}

export { refreshTokenHourly };