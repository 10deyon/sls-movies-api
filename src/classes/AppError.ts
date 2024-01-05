class AppError extends Error {
    message: string;

    constructor(message: string) {
        super();
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
