import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import config from '../../config/index.js'
import { findOneOrderRepo, findManyOrdersRepo, createdOrderRepo, patchOrderStatusRepo, findMySalesRepo } from './sales.repository.js'
import { validateSaleStatusTransition } from './sales.helper.js'

export const findOneOrderSrvc = async ({ match, select }) => {
	const fetchedOrder = await findOneOrderRepo({ match, select })
	return fetchedOrder
}
export const findManyOrdersSrvc = async ({ match, page, limit }) => {
	try {
		page = parseInt(page, 10)
		limit = parseInt(limit, 10)
		const fetchedManyOrders = await findManyOrdersRepo({ match, page, limit })
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

export const calculateFinalPriceSrvc = ({ price, quantity }) => {
	try {
		const finalPrice = { value: { tnd: price.value.tnd * quantity, usd: price.value.usd * quantity || null, eur: price.value.eur * quantity || null } }
		log({ level: 'debug', message: 'calculateFinalPriceSrvc', data: finalPrice })
		return finalPrice
	} catch (err) {
		throw errorHandler({ err })
	}
}

export const patchOrderStatusSrvc = async ({ match, oldStatus, newStatus }) => {
	try {
		if (!validateSaleStatusTransition(oldStatus, newStatus)) {
			log({ level: 'debug', message: 'invalid status transition', data: { oldStatus, newStatus } })
			return { message: 'invalid status transition', data: null }
		}
		const patchedOrder = await patchOrderStatusRepo({ match, status: newStatus })
		return { message: 'sale status patched successfully', data: patchedOrder }
	} catch (err) {
		throw errorHandler({ err })
	}
}

export const findMySalesSrvc = async ({ match, page, limit, count, select }) => {
	try {
		page = parseInt(page, 10)
		limit = parseInt(limit, 10)
		log({ level: 'debug', message: 'findMySalesSrvc', data: { match, page, limit, count, select } })
		const mySales = await findMySalesRepo({ match, page, limit, count, select })
		return mySales
	} catch (err) {
		errorHandler({ err })
	}
}
