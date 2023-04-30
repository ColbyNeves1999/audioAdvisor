import Joi from 'joi';
import { makeValidator } from '../utils/makeValidator';

//Makes sure that the email for new users is kept consistent
const newUserSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    password: Joi.string()
        .min(5)
        .required(),
});

const validateNewUserBody = makeValidator(newUserSchema, 'body');

//Makes sure that the email for logging in users is kept consistent

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .required(),

    password: Joi.string()
        .required(),
});
const validateLoginBody = makeValidator(loginSchema, 'body');

//Makes sure that the email for logging in users is kept consistent

const yearSchema = Joi.object({
    year: Joi.number()
        .integer()
        .min(1900)
        .max(2023),

});

const validateyearBody = makeValidator(yearSchema, 'body');

export { validateNewUserBody, validateLoginBody, validateyearBody };