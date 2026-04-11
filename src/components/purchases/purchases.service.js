import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import config from '../../config/index.js'
import { findOneOrderRepo, patchOrderStatusRepo, appendProductsToOrderRepo } from './purchases.repository.js'
import { orderStatusEnum } from '../orders/orders.enum.js'
import { createdOrderRepo } from '../orders/orders.repository.js'
import { notify } from '../../core/notifications/index.js'

export const findOneOrderSrvc = async ({ match, select }) => {
	const fetchedOrder = await findOneOrderRepo({ match, select })
	return fetchedOrder
}

export const createPurchaseSrvc = async ({ customer, shop, products, status, price }) => {
	//log({ level: 'debug', message: 'createPurchaseSrvc', data: { customer, shop, products, status, price } })
	notify({ user: shop.owner, template: { slug: 'purchase_request' }, kind: 'push', at: 'now', data: { customer, shop, products, price } })
	return createdOrderRepo({ customer, shop, products, status, price })
}

export const processLineTotalSrvc = ({ price, quantity }) => {
	//log({level:'debug',message:'process line total',data:{price,quantity}})
	return { tnd: price.total.tnd * quantity, usd: price.total.usd * quantity || null, eur: price.total.eur * quantity || null }
}

export const patchOrderStatusSrvc = async ({ match, oldStatus, newStatus }) => {
	try {
		if (!validateSaleStatusTransition(oldStatus, newStatus)) {
			log({ level: 'debug', message: 'invalid status transition', data: { oldStatus, newStatus } })
			return { message: 'invalid status transition', data: null }
		}
		const patchedOrder = await patchOrderStatusRepo({ match, status: newStatus })
		return { message: 'purchase status patched successfully', data: patchedOrder }
	} catch (err) {
		throw errorHandler({ err })
	}
}

export const appendProductsToOrderSrvc = async ({ orderId, products }) => {
	return appendProductsToOrderRepo({ orderId, products })
}

/**
 * Validates a status transition for a purchase.
 * @param {string} oldStatus The current status of the purchase.
 * @param {string} newStatus The new status to transition to.
 * @returns {boolean} True if the transition is valid, false otherwise.
 */
export function validateSaleStatusTransition(oldStatus, newStatus) {
	const allowedTransitions = {
		[orderStatusEnum.PENDING_SHOP_CONFIRMATION]: [orderStatusEnum.CONFIRMED_BY_SHOP, orderStatusEnum.CANCELLED_BY_SHOP, orderStatusEnum.CANCELLED_BY_CUSTOMER],
		[orderStatusEnum.CONFIRMED_BY_SHOP]: [
			orderStatusEnum.RESERVED_BY_SHOP_FOR_PICKUP_BY_CUSTOMER,
			orderStatusEnum.DELIVERING_TO_CUSTOMER,
			orderStatusEnum.CANCELLED_BY_SHOP,
			orderStatusEnum.CANCELLED_BY_CUSTOMER // <--- Added this line
		],
		[orderStatusEnum.RESERVED_BY_SHOP_FOR_PICKUP_BY_CUSTOMER]: [
			orderStatusEnum.RECEIVED_BY_CUSTOMER,
			orderStatusEnum.RESERVATION_EXPIRED,
			orderStatusEnum.CANCELLED_BY_CUSTOMER // Often allowed if they haven't picked it up yet
		],
		[orderStatusEnum.DELIVERING_TO_CUSTOMER]: [orderStatusEnum.DELIVERED_TO_CUSTOMER, orderStatusEnum.CANCELLED_BY_SHOP],
		[orderStatusEnum.DELIVERED_TO_CUSTOMER]: [orderStatusEnum.RECEIVED_BY_CUSTOMER],
		[orderStatusEnum.RECEIVED_BY_CUSTOMER]: [],
		[orderStatusEnum.RESERVATION_EXPIRED]: [],
		[orderStatusEnum.CANCELLED_BY_CUSTOMER]: [],
		[orderStatusEnum.CANCELLED_BY_SHOP]: []
	}

	const validNextSteps = allowedTransitions[oldStatus]

	if (!validNextSteps) {
		return false
	}

	return validNextSteps.includes(newStatus)
}
