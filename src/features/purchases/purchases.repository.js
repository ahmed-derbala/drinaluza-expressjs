import { OrderModel } from '../orders/orders.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb, formatMongoQuery } from '#mongodb'
import { log } from '../../core/log/index.js'

export const findOneOrderRepo = async ({ match, select }) => {
	try {
		const flattenedMatch = formatMongoQuery(match)
		const fetchedOrder = await OrderModel.findOne({ ...flattenedMatch })
			.select(select)
			.lean()
		return fetchedOrder
	} catch (err) {
		errorHandler({ err })
	}
}

export const patchOrderStatusRepo = async ({ match, status }) => {
	try {
		const flattenedMatch = formatMongoQuery(match)
		const patchedOrder = await OrderModel.findOneAndUpdate({ ...flattenedMatch }, { status }, { returnDocument: 'after' })
		return patchedOrder
	} catch (err) {
		throw errorHandler({ err })
	}
}

export const appendProductsToOrderRepo = async ({ orderId, products }) => {
	return OrderModel.findByIdAndUpdate(orderId, { $push: { products } }, { returnDocument: 'after' })
}
