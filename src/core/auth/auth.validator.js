import * as expressValidator from 'express-validator'
const { checkSchema, body, query, oneOf } = expressValidator
export const signinVld = [oneOf([body('email').trim().isEmail(), body('slug').trim().notEmpty().isString()]), body('password').trim().isString().notEmpty()]
export const signupVld = [oneOf([body('email').trim().isEmail(), body('slug').trim().notEmpty().isString()]), body('password').trim().isString().notEmpty()]
