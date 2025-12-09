import { OrderModel } from '../orders/orders.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'
import { flattenObject } from '../../core/helpers/filters.js'
export const findOneOrderRepo = async ({ match, select }) => {
	try {
		const flattenedMatch = flattenObject(match)
		const fetchedOrder = await OrderModel.findOne({ ...flattenedMatch })
			.select(select)
			.lean()
		return fetchedOrder
	} catch (err) {
		errorHandler({ err })
	}
}
export const findManyOrdersRepo = async ({ match, page, limit }) => {
	try {
		const flattenedMatch = flattenObject(match)
		const fetchedManyOrders = paginateMongodb({ model: OrderModel, match: { ...flattenedMatch }, select: '', page, limit })
		return fetchedManyOrders
	} catch (err) {
		errorHandler({ err })
	}
}
export const createdOrderRepo = async ({ data }) => {
	try {
		const createdOrder = await OrderModel.create({ ...data })
		return createdOrder
	} catch (err) {
		throw errorHandler({ err })
	}
}

export const patchOrderStatusRepo = async ({ match, status }) => {
	try {
		const flattenedMatch = flattenObject(match)
		const patchedOrder = await OrderModel.findOneAndUpdate({ ...flattenedMatch }, { status }, { new: true })
		return patchedOrder
	} catch (err) {
		throw errorHandler({ err })
	}
}
