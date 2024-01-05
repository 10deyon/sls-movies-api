import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import moment from 'moment-timezone';
import AppError from '../classes/AppError';
import { CreateMovie, UpdateMovie } from '../interfaces/MovieInterface';
import config from '../config/config';
import connection from '../config/db.config';

const dateCreated = () => {
    moment.tz.setDefault(config.app_timezone);
    const currentTime = moment();
    const createdAt = new Date(currentTime.format('YYYY-MM-DD HH:mm:ss'));

    return createdAt;
};

class MovieService {
    /**
     * Retrieves a paginated list of movies from the database.
     *
     * @param {string[]} selectedFields - An optional array of fields to select from the movies table. Defaults to all fields ('*').
     * @param {string} page - The page number for pagination. Defaults to page 1 if not provided.
     * @param {string} limit - The number of records to retrieve per page. Defaults to 10 if not provided.
     * @returns {Promise<RowDataPacket[]>} A Promise that resolves to an array of movie records.
     *
     */
    async index(selectedFields: string[] = ['*'], page: string, limit: string): Promise<RowDataPacket[]> {
        const pageNumber: number = page ? parseInt(page, 10) : 1;
        const newLimit: number = limit ? parseInt(limit, 10) : 10;
        const offset: number = limit ? (pageNumber - 1) * newLimit : 10;

        const selectedFieldsString: string = selectedFields.join(', ');
        const [movies] = await (
            await connection
        ).query<RowDataPacket[]>(
            `SELECT ${selectedFieldsString} FROM movies ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [newLimit, offset],
        );

        return movies;
    }

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

    /**
     * Updates a movie record in the database.
     *
     * @param {UpdateMovie} updateMoviePayload - The payload containing information to update the movie.
     * @param {string} id - The ID of the movie to be updated.
     * @returns {Promise<Movie>} A Promise that resolves to the updated movie record.
     *
     * @throws {AppError} If the movie with the given ID does not exist or if there's an error during the update process.
     */
    async update(updateMoviePayload: UpdateMovie, id: string) {
        try {
            const existingMovie = await this.getOne(['id', 'title', 'producer', 'created_at'], id);

            updateMoviePayload.updated_at = dateCreated();

            await (await connection).query('UPDATE movies SET ? WHERE id = ?', [updateMoviePayload, id]);

            updateMoviePayload.updated_at = undefined;
            return { ...existingMovie, ...updateMoviePayload };
        } catch (error) {
            console.error('ERROR UPDATING MOVIE RECORD', error);
            throw new AppError('An error occurred while updating the record. Please try again.');
        }
    }

    /**
     * Retrieves a single movie record from the database based on the provided ID.
     *
     * @param {string[]} selectedFields - An optional array of fields to select from the movies table. Defaults to all fields ('*').
     * @param {string} id - The ID of the movie to retrieve.
     * @returns {Promise<RowDataPacket>} A Promise that resolves to the movie record.
     *
     * @throws {AppError} If the movie with the given ID does not exist or if there's an error during the retrieval process.
     */
    async getOne(selectedFields = ['*'], id: string): Promise<RowDataPacket> {
        try {
            const selectedFieldsString = selectedFields.join(', ');
            const [result] = await (
                await connection
            ).query<RowDataPacket[]>(`SELECT ${selectedFieldsString} FROM movies WHERE id = ?`, [
                parseInt(id as string, 10),
            ]);

            const movie = result[0];
            if (!movie) {
                throw new AppError('Movie record does not exist');
            }

            return movie;
        } catch (error) {
            console.error('ERROR GETTING MOVIE RECORD', error);
            throw new AppError('An error occurred while retrieving the record. Please try again.');
        }
    }

    /**
     * Deletes a movie record from the database based on the provided ID.
     *
     * @param {string} id - The ID of the movie to be deleted.
     * @returns {Promise<void>} A Promise that resolves once the deletion is successful.
     *
     * @throws {AppError} If the movie with the given ID does not exist or if there's an error during the deletion process.
     */
    async delete(id: string): Promise<void> {
        try {
            await this.getOne(['id'], id);
            await (await connection).query('DELETE FROM movies WHERE id = ?', [parseInt(id as string, 10)]);
        } catch (error) {
            console.error('ERROR DELETING MOVIE RECORD', error);
            throw new AppError('An error occurred while deleting the record. Please try again.');
        }
    }
}

const MovieServiceInstance = new MovieService();

export default MovieServiceInstance;
