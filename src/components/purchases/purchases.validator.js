import * as expressValidator from 'express-validator'
const { checkSchema, body, query, oneOf, param } = expressValidator
import { orderStatusEnum } from '../orders/orders.enum.js'

export const createPurchaseVld = [
	//body('shop').isObject().notEmpty(),
	body('products').isArray({ min: 1 }).withMessage('must be array with at least 1 product'),
	body('products.*.product.slug').isString().notEmpty().withMessage('Each item must have a valid slug'),
	body('products.*.quantity').isNumeric().notEmpty().withMessage('Each item must have a valid quantity')

	//body('products.*.product._id').isMongoId().withMessage('Each item must have a valid MongoDB ObjectId in _id field')
]

export const patchOrderStatusVld = [body('status').isIn(Object.values(orderStatusEnum))]
