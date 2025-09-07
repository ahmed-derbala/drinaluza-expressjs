import * as expressValidator from 'express-validator'
const { checkSchema, body, query, oneOf, param } = expressValidator
import { orderStatusEnum } from './orders.enum.js'
export const createOrderVld = [
	body('shop').isObject().notEmpty(),
	body('products').isArray({ min: 1 }).withMessage('must be array with at least 1 product'),
	body('products.*.product.slug').isString().notEmpty().withMessage('Each item must have a valid slug')

	//body('products.*.product._id').isMongoId().withMessage('Each item must have a valid MongoDB ObjectId in _id field')
]

export const patchOrderStatusVld = [param('status').isIn(Object.values(orderStatusEnum))]
