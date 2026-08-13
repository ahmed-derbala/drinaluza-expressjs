import * as expressValidator from 'express-validator'
const { body, param } = expressValidator

export const patchNotificationVld = [body('seenAt').isISO8601().notEmpty()]
export const getNotificationVld = [param('notificationId').isMongoId().notEmpty()]
