import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ResponseHandler } from '../utils/ResponseHandler';
import AppError from '../utils/AppError';
import MovieServiceInstance from '../services/movie.service';
import { CreateMovie, UpdateMovie } from '../interfaces/MovieInterface';
import movieValidation from '../dto/movie.dto';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const createHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const eventBody: any = event.body;
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

export const updateHandler = async (event: APIGatewayProxyEvent): Promise<ResponseHandler> => {
    try {
        const movieId = Number(event.pathParameters?.id);

        const eventBody: any = event.body;
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
        const movieId = Number(event.pathParameters?.id);

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

export const indexHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const page: string | undefined = event.queryStringParameters?.page;
        const limit: string | undefined = event.queryStringParameters?.limit;

        console.log('THIS IS THE PAGE: ', page);
        console.log('THIS IS THE LIMIT: ', limit);

        const pageNumber: number = page ? parseInt(page, 10) : 1;
        const newLimit: number = limit ? parseInt(limit as string, 10) : 10;
        const offset: number = limit ? (pageNumber - 1) * newLimit : 10;

        console.log('pageNumber', pageNumber);
        console.log('newLimit', newLimit);
        console.log('offset', offset);
        const movies = await MovieServiceInstance.index(['id', 'title', 'producer', 'created_at'], newLimit, offset);
        console.log(movies, 'movies');
        const totalMovies = await MovieServiceInstance.countRecord();

        const total = parseInt(totalMovies as string, 10);
        const pages = Math.ceil(total / parseInt(limit as string, 10));
        const currentPage = parseInt(page as string, 10);
        const hasNext = currentPage < pages;
        const hasPrevious = currentPage > 1;

        const paginationInfo = {
            currentPage,
            limit: parseInt(limit as string, 10),
            totalItems: total,
            movies,
            pages,
            hasNext,
            hasPrevious,
        };

        return ResponseHandler.successResponse({
            message: 'Records Fetched Successfully',
            data: paginationInfo,
        });
    } catch (error: any) {
        console.log(error, 'THIS IS THE ERROR');
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
        const movieId = Number(event.pathParameters?.id);

        await MovieServiceInstance.delete(movieId);

        return ResponseHandler.successResponse(
            {
                message: 'Movie record deleted successfully',
                data: null,
            },
            204,
        );
    } catch (error) {
        console.log(error);
        if (error instanceof AppError) {
            return ResponseHandler.failureResponse(
                {
                    message: error.message,
                },
                400,
            );
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
