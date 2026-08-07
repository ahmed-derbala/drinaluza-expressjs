import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import config from '../../config/index.js'
import { findOneOrderRepo, findOrdersRepo, createdOrderRepo, findMySalesRepo, patchSaleRepo, patchSaleStatusRepo } from './sales.repository.js'
import { validateSaleStatusTransition } from './sales.helper.js'
import { notify } from '#core/notifications/index.js'

export const findOneOrderSrvc = async ({ match, select }) => {
	const fetchedOrder = await findOneOrderRepo({ match, select })
	return fetchedOrder
}
export const findOrdersSrvc = async ({ match, page, limit }) => {
	const fetchedOrders = await findOrdersRepo({ match, page, limit })
	return fetchedOrders
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

export const patchSaleStatusSrvc = async ({ match, oldStatus, newStatus }) => {
	if (!validateSaleStatusTransition(oldStatus, newStatus)) {
		log({ level: 'debug', message: 'invalid status transition', data: { oldStatus, newStatus } })
		return { message: 'invalid status transition', data: null }
	}
	const patchedOrder = await patchSaleStatusRepo({ match, status: newStatus })
	return { message: 'sale status patched successfully', data: patchedOrder }
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

export const patchSaleSrvc = async ({ match, sale, newStatus, newProducts }) => {
	if (!validateSaleStatusTransition(sale.status, newStatus)) {
		log({ level: 'debug', message: 'invalid status transition', data: { oldStatus: sale.status, newStatus } })
		return { message: `invalid status transition from ${sale.status} to ${newStatus}`, data: null }
	}

	newProducts = newProducts.map((item) => {
		return { ...item, quantity: parseInt(item.quantity, 10) }
	})
	const patchedSale = await patchSaleRepo({ match, newData: { status: newStatus, products: newProducts } })
	if (patchedSale) {
		notify({ user: sale.customer, screen: '/purchases', template: { slug: 'purchase_updated_by_business' }, data: { customer: sale.customer, business: sale.business } })
	}
	return { message: 'sale patched successfully', data: patchedSale }
}
