import * as expressValidator from 'express-validator'
const { checkSchema, body, query, oneOf, param } = expressValidator

export const createProductVld = [
	body('price').isObject().notEmpty(),
	oneOf([body('business._id').isMongoId(), body('business.slug').isString()])
	//body('photos').trim().isString().notEmpty(),
	//body('searchKeywords').trim().isString().notEmpty(),
	//body('availability').trim().isString().notEmpty(),
	//body('stock').trim().isString().notEmpty()
]

export const findOneProductVld = [param('productSlug').isString().notEmpty().trim()]
