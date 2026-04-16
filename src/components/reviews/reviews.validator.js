import * as expressValidator from 'express-validator'
const { checkSchema, body, query, oneOf, param } = expressValidator

export const createReviewVld = [
	param('targetResource').isString().notEmpty().trim(),
	param('targetId').isMongoId().notEmpty(),
	body('stars').isNumeric().notEmpty(),
	body('comment').isString().notEmpty().trim()
]
