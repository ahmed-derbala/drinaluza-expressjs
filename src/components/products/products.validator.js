import * as expressValidator from 'express-validator'
const { checkSchema, body, query, oneOf } = expressValidator
export const createProductVld = [
	body('name').trim().isString().notEmpty(),
	body('price').isObject().notEmpty(),
	oneOf([body('shop._id').isMongoId(), body('shop.slug').isString()])
	//body('photos').trim().isString().notEmpty(),
	//body('searchTerms').trim().isString().notEmpty(),
	//body('availability').trim().isString().notEmpty(),
	//body('stock').trim().isString().notEmpty()
]
