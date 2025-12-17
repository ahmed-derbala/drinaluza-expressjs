import * as expressValidator from 'express-validator'
const { body } = expressValidator

export const patchNotificationVld = [body('seenAt').isISO8601().notEmpty()]
