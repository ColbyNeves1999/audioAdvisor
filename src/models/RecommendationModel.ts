import { AppDataSource } from '../dataSource';
import { Song } from '../entities/Song';

const songRepository = AppDataSource.getRepository(Song);

function getRandomInt(max: number): number {

    //const max = await songRepository.count();

    //Fills the array(10) with -1 to make sure no unintentional matches happen
    let value = Math.floor(Math.random() * max);

    return value;
}

function arrayToString(value: string[]): string {

    let retuVal = value[1];

    for(let i = 2; i < value.length; i++){

        retuVal = retuVal + ", " + value[i];

    }

    return retuVal;
}

async function getGenreArray(): Promise<string[]> {
    
    let genreArray = new Array();

    const repoSize = await songRepository.count();
    let rowValues = 0;

    for( let i = 1; i <= repoSize; i++){

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

async function getSongRecommendationByDecade(year: number): Promise<Song | null> {

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

    for( let i = 0; i < repoSize; i++){

        rowValues = i;

        const results = await songRepository
            .createQueryBuilder('song')
            .where('rowid = :rowValues', { rowValues })
            .getOne();

        if (results) {
            temp = new Date(results.releaseYear).getFullYear();
            if(temp >= beginTemp && temp <= endTemp){
                yearArray.push(results);

            }
        }

    } 

    const randValue = getRandomInt(yearArray.length);

    const resultingSong = yearArray[randValue];

    return resultingSong;

}

async function getSongRecommendationByGenre(genre: string): Promise<Song | null> {

    let rowValues = 0;
    let temp;
    const repoSize = await songRepository.count();
    let genreArray = [];
    let resultingSong;

    const doesItExist = await songRepository
    .createQueryBuilder('song')
    .where('genre = :genre', { genre })
    .getOne();

    if(doesItExist){

        for( let i = 0; i < repoSize; i++){

            rowValues = i;

            const results = await songRepository
                .createQueryBuilder('song')
                .where('rowid = :rowValues', { rowValues })
                .getOne();

            if (results) {
                temp = results.genre;
                if(temp === genre){
                    genreArray.push(results);

                }
            }

        } 

        const randValue = getRandomInt(genreArray.length);

        resultingSong = genreArray[randValue];
    }else{
        resultingSong = null;
    }
    
        return resultingSong;

}

export { getSongRecommendationByDecade, getSongRecommendationByGenre, getGenreArray, arrayToString };