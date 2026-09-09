import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import { config } from '#config'
import { findOrdersRepo, createdOrderRepo, findMySalesRepo, patchSaleRepo, patchSaleStatusRepo } from './sales.repository.js'
import { findOneOrderRepo } from '#orders/orders.repository.js'
import { isValidStatusTransitionSrvc } from '#orders'
import { notify, NOTIFICATIONS_TEMPLATES } from '#notifications'
import { USER_ROLES } from '#users'

export const findOneSaleSrvc = async ({ match, select }) => {
	const fetchedSale = await findOneOrderRepo({ match, select })
	return fetchedSale
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
	const role = USER_ROLES.business_owner
	if (!isValidStatusTransitionSrvc({ oldStatus: sale.status, newStatus, role })) {
		log({ level: 'debug', message: 'invalid status transition', data: { oldStatus: sale.status, newStatus } })
		return { message: `invalid status transition from ${sale.status} to ${newStatus}`, data: null }
	}

	newProducts = newProducts.map((item) => {
		return { ...item, quantity: parseInt(item.quantity, 10) }
	})
	const patchedSale = await patchSaleRepo({ match, newData: { status: newStatus, products: newProducts } })
	if (patchedSale) {
		notify({
			user: patchedSale.customer,
			screen: `/purchases/${patchedSale._id}`,
			template: { slug: NOTIFICATIONS_TEMPLATES[patchedSale.status], data: { customer: patchedSale.customer, business: patchedSale.business } },
			media: patchedSale.business.media
		})
	}
	return { message: 'sale patched successfully', data: patchedSale }
}

export const patchSaleStatusSrvc = async ({ match, sale, newStatus }) => {
	const role = USER_ROLES.business_owner
	if (!isValidStatusTransitionSrvc({ oldStatus: sale.status, newStatus, role })) {
		log({ level: 'debug', message: 'invalid status transition', data: { oldStatus: sale.status, newStatus, role } })
		return { message: 'invalid status transition', data: null }
	}
	const patchedSale = await patchSaleStatusRepo({ match, status: newStatus })
	if (patchedSale) {
		notify({
			user: patchedSale.customer,
			screen: `/purchases/${patchedSale._id}`,
			template: { slug: NOTIFICATIONS_TEMPLATES[patchedSale.status], data: { customer: patchedSale.customer, business: patchedSale.business } },
			media: patchedSale.business.media
		})
	}
	return { message: 'sale status patched successfully', data: patchedSale }
}
