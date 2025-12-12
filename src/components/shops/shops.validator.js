import * as expressValidator from 'express-validator'
const { checkSchema, body, query, oneOf } = expressValidator
export const createShopVld = [
	body('name').trim().isString().notEmpty(),
	body('address').isObject().notEmpty(),
	//body('location').isObject().notEmpty(),
	body('operatingHours').trim().isString(),
	body('deliveryRadiusKm').trim().isString()
]
