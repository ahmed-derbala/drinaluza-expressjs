import { ORDER_STATUSES } from '#orders/orders.constant.js'

/**
 * Defines the complete set of valid sale status transitions.
 * This structure is a State Transition Map: Key = Old Status, Value = Array of Valid New Statuses.
 */
const validTransitions = {
	// Initial and main progression states
	[ORDER_STATUSES.PENDING_BUSINESS_CONFIRMATION]: [
		ORDER_STATUSES.CONFIRMED_BY_BUSINESS,
		ORDER_STATUSES.CANCELLED_BY_BUSINESS,
		// Allow user to cancel before business confirms
		ORDER_STATUSES.CANCELLED_BY_CUSTOMER
	],

	[ORDER_STATUSES.CONFIRMED_BY_BUSINESS]: [
		ORDER_STATUSES.RESERVED_BY_BUSINESS_FOR_PICKUP_BY_CUSTOMER,
		ORDER_STATUSES.DELIVERING_TO_CUSTOMER,
		ORDER_STATUSES.CANCELLED_BY_BUSINESS,
		// Allow user to cancel after business confirms
		ORDER_STATUSES.CANCELLED_BY_CUSTOMER
	],

	// Pickup flow states
	[ORDER_STATUSES.RESERVED_BY_BUSINESS_FOR_PICKUP_BY_CUSTOMER]: [
		ORDER_STATUSES.RECEIVED_BY_CUSTOMER, // Pickup successful
		ORDER_STATUSES.RESERVATION_EXPIRED,
		ORDER_STATUSES.CANCELLED_BY_BUSINESS,
		ORDER_STATUSES.CANCELLED_BY_CUSTOMER
	],

	// Delivery flow states
	[ORDER_STATUSES.DELIVERING_TO_CUSTOMER]: [ORDER_STATUSES.DELIVERED_TO_CUSTOMER, ORDER_STATUSES.CANCELLED_BY_BUSINESS, ORDER_STATUSES.CANCELLED_BY_CUSTOMER],

	[ORDER_STATUSES.DELIVERED_TO_CUSTOMER]: [
		ORDER_STATUSES.RECEIVED_BY_CUSTOMER, // Customer confirmed receipt
		ORDER_STATUSES.CANCELLED_BY_BUSINESS // Business cancels even after delivery attempt (e.g., failed delivery, return initiated)
	],

	// Final successful state
	[ORDER_STATUSES.RECEIVED_BY_CUSTOMER]: [
		// No further transitions from a final successful state (unless a return/refund process is introduced)
	],

	// Final failed/exception states
	[ORDER_STATUSES.RESERVATION_EXPIRED]: [
		// No further transitions from an expired state
	],

	[ORDER_STATUSES.CANCELLED_BY_CUSTOMER]: [
		// No further transitions from a final cancellation state
	],

	[ORDER_STATUSES.CANCELLED_BY_BUSINESS]: [
		// No further transitions from a final cancellation state
	]
}

/**
 * Validates a status transition for a sale using a comprehensive State Transition Map.
 * @param {string} oldStatus The current status of the sale.
 * @param {string} newStatus The new status to transition to.
 * @returns {boolean} True if the transition is valid, false otherwise.
 */
export const validateSaleStatusTransition = (oldStatus, newStatus) => {
	// If the old status is not in the map, it's an unrecognized or final state
	// from which no progression is possible (e.g., RECEIVED_BY_CUSTOMER, CANCELLED_BY_BUSINESS).
	const possibleNextStatuses = validTransitions[oldStatus]

	if (!possibleNextStatuses) {
		// Log an error/warning if the oldStatus is not a recognized enum value
		if (!Object.values(ORDER_STATUSES).includes(oldStatus)) {
			console.error(`Unrecognized oldStatus: ${oldStatus}`)
		}
		return false
	}

	// The transition is valid if the newStatus is found in the array of possible next statuses
	// for the given oldStatus.
	return possibleNextStatuses.includes(newStatus)
}
