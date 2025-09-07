import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import config from '../../config/index.js'
import { findOneOrderRepo, findManyOrdersRepo, createdOrderRepo } from './orders.repository.js'
export const findOneOrderSrvc = async ({ match, select }) => {
	const fetchedOrder = await findOneOrderRepo({ match, select })
	return fetchedOrder
}
export const findManyOrdersSrvc = async ({ match, select, page, limit }) => {
	try {
		page = parseInt(page, 10)
		limit = parseInt(limit, 10)
		const fetchedManyOrders = await findManyOrdersRepo({ match, select, page, limit })
		return fetchedManyOrders
	} catch (err) {
		errorHandler({ err })
	}
}
export const createOrderSrvc = async ({ data }) => {
	try {
		const createdOrder = await createdOrderRepo({ data })
		return createdOrder
	} catch (err) {
		throw errorHandler({ err })
	}
}

export const calculateFinalPriceSrvc = async ({ price, quantity }) => {
	try {
		const finalPrice = price * quantity
		return finalPrice
	} catch (err) {
		throw errorHandler({ err })
	}
}
