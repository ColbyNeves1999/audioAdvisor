import { AppDataSource } from '../dataSource';
import { Song } from '../entities/Song';

const songRepository = AppDataSource.getRepository(Song);

async function getRandomInt(): Promise<number> {

    const max = await songRepository.count();

    //Fills the array(10) with -1 to make sure no unintentional matches happen
    let value = Math.floor(Math.random() * max);

    return value;
}

async function getSongRecommendationByDecade(year: number): Promise<Song | null> {

    let count = 1;
    let exit = 0;

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

    let beginTemp = beginningYear.getTime();
    let endTemp = endYear.getTime();

    let rowValues = 0;
    let results = null;
    let temp;
    do {
        while (rowValues === 0) {
            rowValues = await getRandomInt();
        }

        results = await songRepository
            .createQueryBuilder('song')
            .where('rowid = :rowValues', { rowValues })
            .getOne();


        if (results.releaseYear !== null) {
            temp = new Date(results.releaseYear);
        }

        if (temp.getTime() >= beginTemp && temp.getTime() <= endTemp) {
            console.log("It is");
            exit = 1;
        }

        count = count + 1;

    } while (count <= await songRepository.count() && exit !== 1)

    if (count > await songRepository.count() && exit === 0) {
        exit = 0;
        count = 0;
        while (count < await songRepository.count() && exit !== 1) {
            rowValues = 1;

            results = await songRepository
                .createQueryBuilder('song')
                .where('rowid = :rowValues', { rowValues })
                .getOne();


            if (results.releaseYear !== null) {
                temp = new Date(results.releaseYear);
            }

            if (temp.getTime() >= beginTemp && temp.getTime() <= endTemp) {
                console.log("It is");
                exit = 1;
            }

            count = count + 1;
        }
    }

    return results;

}

export { getSongRecommendationByDecade };