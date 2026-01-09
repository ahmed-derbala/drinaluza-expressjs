import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import config from '../../config/index.js'
import { findOneOrderRepo, createdOrderRepo, patchOrderStatusRepo, appendProductsToOrderRepo } from './purchases.repository.js'
import { orderStatusEnum } from '../orders/orders.enum.js'

export const findOneOrderSrvc = async ({ match, select }) => {
	const fetchedOrder = await findOneOrderRepo({ match, select })
	return fetchedOrder
}

export const createOrderSrvc = async ({ data }) => {
	try {
		const createdOrder = await createdOrderRepo({ data })
		return createdOrder
	} catch (err) {
		throw errorHandler({ err })
	}
}

export const processFinalPriceSrvc = ({ price, quantity }) => {
	try {
		const finalPrice = { value: { tnd: price.value.tnd * quantity, usd: price.value.usd * quantity || null, eur: price.value.eur * quantity || null }, quantity }
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
		return { message: 'purchase status patched successfully', data: patchedOrder }
	} catch (err) {
		throw errorHandler({ err })
	}
}

export const appendProductsToOrderSrvc = async ({ orderId, products }) => {
	return appendProductsToOrderRepo({ orderId, products })
}

/**
 * Validates a status transition for an purchase.
 * @param {string} oldStatus The current status of the purchase.
 * @param {string} newStatus The new status to transition to.
 * @returns {boolean} True if the transition is valid, false otherwise.
 */
function validateSaleStatusTransition(oldStatus, newStatus) {
	// A list of the valid statuses in their correct progressive purchase.
	const orderedStatuses = [orderStatusEnum.PENDING_SHOP_CONFIRMATION, orderStatusEnum.DELIVERING_TO_USER, orderStatusEnum.DELIVERED_TO_USER, orderStatusEnum.CANCELLED_BY_SHOP]

	if (oldStatus === orderStatusEnum.CANCELLED_BY_USER && newStatus === orderStatusEnum.CANCELLED_BY_SHOP) return false
	const oldStatusIndex = orderedStatuses.indexOf(oldStatus)
	const newStatusIndex = orderedStatuses.indexOf(newStatus)

	// If either status is not in the ordered list, it's an invalid transition.
	if (oldStatusIndex === -1 || newStatusIndex === -1) {
		return false
	}
	// A valid transition means the new status's index must be greater than the old status's index.
	return newStatusIndex > oldStatusIndex
}
