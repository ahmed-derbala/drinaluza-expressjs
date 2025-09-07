import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import config from '../../config/index.js'
import { findOneOrderRepo, findManyOrdersRepo, createdOrderRepo, patchOrderStatusRepo } from './orders.repository.js'
import { orderStatusEnum } from './orders.enum.js'
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
		if (!validateStatusTransition(oldStatus, newStatus)) {
			log({ level: 'debug', message: 'invalid status transition', data: { oldStatus, newStatus } })
			return { message: 'invalid status transition', data: null }
		}
		const patchedOrder = await patchOrderStatusRepo({ match, status: newStatus })
		return { message: 'order status patched successfully', data: patchedOrder }
	} catch (err) {
		throw errorHandler({ err })
	}
}

/**
 * Validates a status transition for an order.
 * @param {string} oldStatus The current status of the order.
 * @param {string} newStatus The new status to transition to.
 * @returns {boolean} True if the transition is valid, false otherwise.
 */
function validateStatusTransition(oldStatus, newStatus) {
	// A list of the valid statuses in their correct progressive order.
	const orderedStatuses = [orderStatusEnum.PENDING_SHOP_CONFIRMATION, orderStatusEnum.DELIVERING_TO_USER, orderStatusEnum.DELIVERED_TO_USER]

	// The user's rule states that oldStatus and newStatus cannot be a cancelled status.
	const cancelledStatuses = [orderStatusEnum.CANCELLED_BY_SHOP]

	if (cancelledStatuses.includes(oldStatus) || cancelledStatuses.includes(newStatus)) {
		return false
	}

	const oldStatusIndex = orderedStatuses.indexOf(oldStatus)
	const newStatusIndex = orderedStatuses.indexOf(newStatus)

	// If either status is not in the ordered list, it's an invalid transition.
	if (oldStatusIndex === -1 || newStatusIndex === -1) {
		return false
	}

	// A valid transition means the new status's index must be greater than the old status's index.
	return newStatusIndex > oldStatusIndex
}
