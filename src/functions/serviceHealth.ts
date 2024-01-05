import { APIGatewayProxyResult } from 'aws-lambda';
import { ResponseHandler } from '../classes/ResponseHandler';

export const handler = async (): Promise<APIGatewayProxyResult> => {
    return ResponseHandler.successResponse({
        message: 'Movie service is active...',
    });
};
