import { AppDataSource } from '../dataSource';
import { Song } from '../entities/Song';

const songRepository = AppDataSource.getRepository(Song);

//Random number for game URL array
function getRandomInt(max: number): number {

    let value = Math.floor(Math.random() * max);

    return value;
}

//Converts an array to string in necessary instances
function arrayToString(value: string[]): string {

    let retuVal = value[1];

    for (let i = 2; i < value.length; i++) {

        retuVal = retuVal + ", " + value[i];

    }

    return retuVal;
}

//Gets an array of all songs with a given genre
async function getGenreArray(): Promise<string[]> {

    let genreArray = new Array();

    const repoSize = await songRepository.count();
    let rowValues = 0;

    for (let i = 1; i <= repoSize; i++) {

        rowValues = i;

        const results = await songRepository
            .createQueryBuilder('song')
            .where('rowid = :rowValues', { rowValues })
            .getOne();

        if (!genreArray.includes(results.genre) && results.genre !== null) {
            genreArray.push(results.genre);
        }
    }

    return genreArray;

}

//Gets song recomendations based on year
async function getSongRecommendationByDecade(year: number): Promise<Song | null> {

    //58-73 are calculating the beginning and end years of a decade
    let tempYear = year;
    let begin = tempYear % 10;

    while (begin !== 0) {

        tempYear = tempYear - 1;
        begin = tempYear % 10;

    }

    let endYear = new Date();
    endYear.setFullYear(tempYear + 9);
    let beginningYear = new Date();
    beginningYear.setFullYear(tempYear);
    let beginTemp = beginningYear.getFullYear();
    let endTemp = endYear.getFullYear();

    let rowValues = 0;
    let temp;
    const repoSize = await songRepository.count();
    let yearArray = [];

    //Grabs all songs from the array of given decade
    for (let i = 0; i < repoSize; i++) {

        rowValues = i;

        const results = await songRepository
            .createQueryBuilder('song')
            .where('rowid = :rowValues', { rowValues })
            .getOne();

        //If it's a viable song and the year is within the range it is added
        if (results) {
            temp = new Date(results.releaseYear).getFullYear();
            if (temp >= beginTemp && temp <= endTemp) {
                yearArray.push(results);

            }
        }

    }

    //chooses random song from array
    const randValue = getRandomInt(yearArray.length);
    const resultingSong = yearArray[randValue];

    return resultingSong;

}

//Gets genre recommendations
async function getSongRecommendationByGenre(genre: string): Promise<Song | null> {

    let rowValues = 0;
    let temp;
    const repoSize = await songRepository.count();
    let genreArray = [];
    let resultingSong;

    for (let i = 0; i < repoSize; i++) {

        rowValues = i;

        const results = await songRepository
            .createQueryBuilder('song')
            .where('rowid = :rowValues', { rowValues })
            .getOne();

        if (results && results.genre) {

            //If the genre is included in the result its added to array
            temp = results.genre;
            if (temp.includes(genre) && genreArray) {
                genreArray.push(results);
            } else {
                resultingSong = null;
            }

        }

    }

    //gets random song from array
    const randValue = getRandomInt(genreArray.length);
    resultingSong = genreArray[randValue];

    return resultingSong;

}

//Gets song by favorite genre
async function getSongRecommendationByFavorite(genre: string): Promise<Song | null> {

    let rowValues = 0;
    let temp;
    const repoSize = await songRepository.count();
    let genreArray = [];
    let resultingSong;

    for (let i = 1; i < repoSize; i++) {

        rowValues = i;

        const results = await songRepository
            .createQueryBuilder('song')
            .where('rowid = :rowValues', { rowValues })
            .getOne();

        if (results && results.genre) {

            temp = results.genre;
            //If favorite genre is in the song then its added
            if (temp.includes(genre) && genreArray) {
                genreArray.push(results);
            }

        }

    }

    //Chooses random song from array
    const randValue = getRandomInt(genreArray.length);
    resultingSong = genreArray[randValue];

    return resultingSong;

}

export { getSongRecommendationByDecade, getSongRecommendationByGenre, getSongRecommendationByFavorite, getGenreArray, arrayToString };