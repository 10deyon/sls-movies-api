import { ResponseFormat } from '../interfaces/ResponseFormatInterface';

export class ResponseHandler {
    static successResponse(payload: Record<string, unknown>, statusCode = 200) {
        const data: ResponseFormat = {
            success: true,
            message: payload.message,
            data: payload.data,
        };

        return {
            statusCode,
            isBase64Encoded: false,
            body: JSON.stringify(data),
        };
    }

    static failureResponse(payload: Record<string, unknown>, statusCode = 400) {
        const data: ResponseFormat = {
            success: false,
            message: payload.message,
        };

        return {
            statusCode,
            isBase64Encoded: false,
            body: JSON.stringify(data),
        };
    }
}
