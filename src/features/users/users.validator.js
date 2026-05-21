import * as expressValidator from 'express-validator'
const { checkSchema, body, query, oneOf } = expressValidator

export const patchMyProfileVld = [body('name').trim().isString().optional(), body('address').isObject().optional(), body('location').isObject().optional(), body('settings').isObject().optional()]
