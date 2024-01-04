import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import moment from 'moment-timezone';
import AppError from '../utils/AppError';
import { CreateMovie, UpdateMovie } from '../interfaces/MovieInterface';
import config from '../utils/config';
import connection from '../lib/db.config';

const dateCreated = () => {
    moment.tz.setDefault(config.app_timezone);
    const currentTime = moment();
    const createdAt = new Date(currentTime.format('YYYY-MM-DD HH:mm:ss'));

    return createdAt;
};

class MovieService {
    /**
     * Creates a new movie record in the database.
     *
     * @param {CreateMovie} createMoviePayload - The payload containing information to create the movie.
     * @returns {Promise<any>} A Promise that resolves to the created movie record.
     * @throws {AppError} If an error occurs during the creation process.
     */
    async create(createMoviePayload: CreateMovie): Promise<ResultSetHeader> {
        try {
            createMoviePayload.created_at = dateCreated();

            const [movie] = await (
                await connection
            ).query<ResultSetHeader>('INSERT INTO movies SET ?', [createMoviePayload]);

            return movie;
        } catch (error) {
            console.error('ERROR CREATING MOVIE RECORD', error);
            throw new AppError('An error occured while creating record, try again.');
        }
    }

    async update(updateMoviePayload: UpdateMovie, id: number) {
        const existingMovie = await this.getOne(['id', 'title', 'producer', 'created_at'], id);

        updateMoviePayload.updated_at = dateCreated();

        await (await connection).query('UPDATE movies SET ? WHERE id = ?', [updateMoviePayload, id]);

        updateMoviePayload.updated_at = undefined;
        return { ...existingMovie, ...updateMoviePayload };
    }

    async index(selectedFields: string[] = ['*'], limit: number, offset: number) {
        const selectedFieldsString: string = selectedFields.join(', ');
        const [movies] = await (
            await connection
        ).query<RowDataPacket[]>(
            `SELECT ${selectedFieldsString} FROM movies ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [limit, offset],
        );

        return movies;
    }

    async getOne(selectedFields = ['*'], id: number) {
        const selectedFieldsString = selectedFields.join(', ');
        const [result] = await (
            await connection
        ).query<RowDataPacket[]>(`SELECT ${selectedFieldsString} FROM movies WHERE id = ?`, [id]);

        const movie = result[0];
        if (!movie) {
            throw new AppError('Movie record does not exist');
        }

        return movie;
    }

    async delete(id: number) {
        await this.getOne(['id', 'title', 'producer', 'created_at'], id);

        await (await connection).query('DELETE FROM movies WHERE id = ?', [id]);
    }

    async countRecord() {
        const [totalCountResult] = await (
            await connection
        ).query<RowDataPacket[]>('SELECT COUNT(*) AS total FROM movies');

        const { total } = totalCountResult[0];

        return total;
    }

    // async paginatedRecord(limit, totalItems, items) {
    //     const total = parseInt(totalItems as string, 10);
    //     const pages = Math.ceil(total / parseInt(limit as string, 10));
    //     const currentPage = parseInt(page as string, 10);
    //     const hasNext = currentPage < pages;
    //     const hasPrevious = currentPage > 1;

    //     const paginationInfo = {
    //         currentPage,
    //         limit: parseInt(limit as string, 10),
    //         totalItems: total,
    //         items: movies,
    //         pages,
    //         hasNext,
    //         hasPrevious,
    //     };

    //     return paginationInfo;
    // }
}

const MovieServiceInstance = new MovieService();

export default MovieServiceInstance;
