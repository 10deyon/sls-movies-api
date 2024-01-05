import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AppError from '../classes/AppError';
import { Paginator } from '../classes/Paginator';
import { ResponseHandler } from '../classes/ResponseHandler';
import MovieServiceInstance from '../services/movie.service';
import { CreateMovie, UpdateMovie } from '../interfaces/MovieInterface';
import movieValidation from '../dto/movie.dto';

export const indexHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const page: string = event.queryStringParameters?.page as string;
        const limit: string = event.queryStringParameters?.limit as string;

        const movies = await MovieServiceInstance.index(['id', 'title', 'producer', 'created_at'], page, limit);

        const paginatedRecord = await Paginator.paginatedRecord('movies', page, limit);
        paginatedRecord.items = movies;

        return ResponseHandler.successResponse({
            message: 'Records Fetched Successfully',
            data: paginatedRecord,
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            return ResponseHandler.failureResponse({
                message: error.message,
            });
        } else {
            return ResponseHandler.failureResponse({
                message: 'An error occured',
            });
        }
    }
};

export const createHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const eventBody: string = event.body as string;
    const requestBody: CreateMovie = JSON.parse(eventBody);

    try {
        const validData = await movieValidation.createMovieDTO(requestBody);
        const movie = await MovieServiceInstance.create(validData);

        validData.id = movie.insertId;
        return ResponseHandler.successResponse(
            {
                message: 'Movie Created Successfully',
                data: validData,
            },
            201,
        );
    } catch (error: any) {
        if (error instanceof Error) {
            return ResponseHandler.failureResponse({
                message: error.message,
            });
        } else {
            return ResponseHandler.failureResponse({
                message: 'An error occured',
            });
        }
    }
};

export const updateHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const movieId: string = event.pathParameters?.id as string;

        const eventBody: string = event.body as string;
        const requestBody: UpdateMovie = JSON.parse(eventBody);

        const validData = await movieValidation.updateMovieDTO(requestBody);

        const movie = await MovieServiceInstance.update(validData, movieId);

        return ResponseHandler.successResponse({
            message: 'Movie record updated successfully',
            data: movie,
        });
    } catch (error: unknown) {
        if (error instanceof AppError) {
            return ResponseHandler.failureResponse({
                message: error.message,
            });
        } else {
            return ResponseHandler.failureResponse({
                message: 'An error occured',
            });
        }
    }
};

export const getHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const movieId: string = event.pathParameters?.id as string;

        const movie = await MovieServiceInstance.getOne(
            ['id', 'title', 'producer', 'release_date', 'created_at'],
            movieId,
        );

        return ResponseHandler.successResponse({
            message: 'Record Fetched Successfully',
            data: movie,
        });
    } catch (error) {
        if (error instanceof AppError) {
            return ResponseHandler.failureResponse({
                message: error.message,
            });
        } else {
            return ResponseHandler.failureResponse({
                message: 'An error occured',
            });
        }
    }
};

export const deleteHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const movieId: string = event.pathParameters?.id as string;

        await MovieServiceInstance.delete(movieId);

        return ResponseHandler.successResponse({}, 204);
    } catch (error) {
        if (error instanceof AppError) {
            return ResponseHandler.failureResponse({
                message: error.message,
            });
        } else {
            return ResponseHandler.failureResponse(
                {
                    message: 'An error occured',
                },
                500,
            );
        }
    }
};
