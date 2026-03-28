import * as expressValidator from 'express-validator'
const { body } = expressValidator

export const expoPushTokenVld = [body('expoPushToken').trim().isString().notEmpty(), body('token').trim().isString().notEmpty()]
