import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import config from '../../config/index.js'
import { findOneOrderRepo, findManyOrdersRepo, createdOrderRepo, patchOrderStatusRepo } from './sales.repository.js'
import { orderStatusEnum } from '../orders/orders.enum.js'
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

/**
 * Defines the complete set of valid sale status transitions.
 * This structure is a State Transition Map: Key = Old Status, Value = Array of Valid New Statuses.
 */
const validTransitions = {
	// Initial and main progression states
	[orderStatusEnum.PENDING_SHOP_CONFIRMATION]: [
		orderStatusEnum.CONFIRMED_BY_SHOP,
		orderStatusEnum.CANCELLED_BY_SHOP,
		// Allow user to cancel before shop confirms
		orderStatusEnum.CANCELLED_BY_CUSTOMER
	],

	[orderStatusEnum.CONFIRMED_BY_SHOP]: [
		orderStatusEnum.RESERVED_BY_SHOP_FOR_PICKUP_BY_CUSTOMER,
		orderStatusEnum.DELIVERING_TO_CUSTOMER,
		orderStatusEnum.CANCELLED_BY_SHOP,
		// Allow user to cancel after shop confirms
		orderStatusEnum.CANCELLED_BY_CUSTOMER
	],

	// Pickup flow states
	[orderStatusEnum.RESERVED_BY_SHOP_FOR_PICKUP_BY_CUSTOMER]: [
		orderStatusEnum.RECEIVED_BY_CUSTOMER, // Pickup successful
		orderStatusEnum.RESERVATION_EXPIRED,
		orderStatusEnum.CANCELLED_BY_SHOP,
		orderStatusEnum.CANCELLED_BY_CUSTOMER
	],

	// Delivery flow states
	[orderStatusEnum.DELIVERING_TO_CUSTOMER]: [orderStatusEnum.DELIVERED_TO_CUSTOMER, orderStatusEnum.CANCELLED_BY_SHOP, orderStatusEnum.CANCELLED_BY_CUSTOMER],

	[orderStatusEnum.DELIVERED_TO_CUSTOMER]: [
		orderStatusEnum.RECEIVED_BY_CUSTOMER, // Customer confirmed receipt
		orderStatusEnum.CANCELLED_BY_SHOP // Shop cancels even after delivery attempt (e.g., failed delivery, return initiated)
	],

	// Final successful state
	[orderStatusEnum.RECEIVED_BY_CUSTOMER]: [
		// No further transitions from a final successful state (unless a return/refund process is introduced)
	],

	// Final failed/exception states
	[orderStatusEnum.RESERVATION_EXPIRED]: [
		// No further transitions from an expired state
	],

	[orderStatusEnum.CANCELLED_BY_CUSTOMER]: [
		// No further transitions from a final cancellation state
	],

	[orderStatusEnum.CANCELLED_BY_SHOP]: [
		// No further transitions from a final cancellation state
	]
}

/**
 * Validates a status transition for a sale using a comprehensive State Transition Map.
 * @param {string} oldStatus The current status of the sale.
 * @param {string} newStatus The new status to transition to.
 * @returns {boolean} True if the transition is valid, false otherwise.
 */
function validateSaleStatusTransition(oldStatus, newStatus) {
	// If the old status is not in the map, it's an unrecognized or final state
	// from which no progression is possible (e.g., RECEIVED_BY_CUSTOMER, CANCELLED_BY_SHOP).
	const possibleNextStatuses = validTransitions[oldStatus]

	if (!possibleNextStatuses) {
		// Log an error/warning if the oldStatus is not a recognized enum value
		if (!Object.values(orderStatusEnum).includes(oldStatus)) {
			console.error(`Unrecognized oldStatus: ${oldStatus}`)
		}
		return false
	}

	// The transition is valid if the newStatus is found in the array of possible next statuses
	// for the given oldStatus.
	return possibleNextStatuses.includes(newStatus)
}
