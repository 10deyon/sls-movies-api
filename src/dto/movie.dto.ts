import Joi from 'joi';
import AppError from '../utils/AppError';
import { CreateMovie, UpdateMovie } from '../interfaces/MovieInterface';

const createMovieDTO = async (payload: CreateMovie) => {
    const payloadOrDefault: CreateMovie = payload || {
        title: '',
        producer: '',
        release_date: '',
    };

    const schema = Joi.object({
        title: Joi.string().trim(true).required().messages({
            'string.empty': 'Title cannot be empty',
            'any.required': 'Title is required',
        }),

        producer: Joi.string().trim(true).required().messages({
            'string.empty': 'Producer cannot be empty',
            'any.required': 'Producer is required',
        }),

        release_date: Joi.string()
            .required()
            .regex(/^\d{4}-\d{2}-\d{2}$/)
            .messages({
                'string.pattern.base': 'Release date should be in this YYYY-MM-DD format',
                'any.required': 'Release date is required',
            }),
    });

    const result = schema.validate(payloadOrDefault);

    const { error, value } = result;
    const valid = error == null;

    if (!valid) {
        throw new AppError(error.details[0].message.replace(/[^\w\s-]/g, ''));
    }

    return value as CreateMovie;
};

const updateMovieDTO = async (payload: UpdateMovie) => {
    const payloadOrDefault: CreateMovie = payload || {
        title: '',
        producer: '',
        release_date: '',
    };

    const schema = Joi.object({
        title: Joi.string().trim(true).messages({
            'string.empty': 'Phone number cannot be empty',
        }),

        producer: Joi.string().trim(true).messages({
            'string.empty': 'Message cannot be empty',
        }),

        release_date: Joi.string()
            .regex(/^\d{4}-\d{2}-\d{2}$/)
            .messages({
                'string.pattern.base': 'Please provide the date of birth in the YYYY-MM-DD format',
            }),
    });

    const result = schema.validate(payloadOrDefault);

    const { error, value } = result;
    const valid = error == null;

    if (!valid) {
        throw new AppError(error.details[0].message.replace(/[^\w\s-]/g, ''));
    }

    return value;
};

const movieValidation = {
    updateMovieDTO,
    createMovieDTO,
};

export default movieValidation;
