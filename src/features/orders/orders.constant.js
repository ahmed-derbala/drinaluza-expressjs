import { createEnum } from '#enum'

export const ORDER_KINDS = {
	TABLE: 'table',
	TAKEAWAY: 'takeaway',
	PICKUP: 'pickup',
	DELIVERY: 'delivery'
}

export const ORDER_KINDS_ALL = () => Object.values(ORDER_KINDS)

export const ORDER_STATUSES_ALL = [
	'pending', // Order placed / awaiting business response or catch-weight adjustments
	'action_required', // Customer must re-approve modified prices/weights
	'accepted', // Business accepted order (or customer approved changes)
	'preparing', // Seafood being cleaned, weighed, packaged
	'ready_for_pickup', // Self-pickup: packed & awaiting customer at store counter
	'finding_courier', // Courier delivery: searching for/broadcasting to nearby drivers
	'courier_assigned', // Courier accepted & en route to business
	'delivering', // In transit to customer (via courier or business driver)
	'delivered', // Terminal success state
	'cancelled' // Terminal cancelled state
]

export const ORDER_STATUSES = createEnum(...ORDER_STATUSES_ALL)

export const PERMITTED_ORDERS_TRANSITIONS = {
	customer: [
		{ from: ORDER_STATUSES.pending, to: ORDER_STATUSES.cancelled },
		{ from: ORDER_STATUSES.action_required, to: ORDER_STATUSES.accepted },
		{ from: ORDER_STATUSES.action_required, to: ORDER_STATUSES.cancelled },
		{ from: ORDER_STATUSES.ready_for_pickup, to: ORDER_STATUSES.delivered }
	],
	business_owner: [
		{ from: ORDER_STATUSES.pending, to: ORDER_STATUSES.action_required },
		{ from: ORDER_STATUSES.pending, to: ORDER_STATUSES.accepted },
		{ from: ORDER_STATUSES.pending, to: ORDER_STATUSES.cancelled },
		{ from: ORDER_STATUSES.accepted, to: ORDER_STATUSES.preparing },
		{ from: ORDER_STATUSES.preparing, to: ORDER_STATUSES.ready_for_pickup },
		{ from: ORDER_STATUSES.preparing, to: ORDER_STATUSES.finding_courier },
		{ from: ORDER_STATUSES.preparing, to: ORDER_STATUSES.cancelled }
	],
	courier: [
		{ from: ORDER_STATUSES.finding_courier, to: ORDER_STATUSES.courier_assigned },
		{ from: ORDER_STATUSES.courier_assigned, to: ORDER_STATUSES.delivering },
		{ from: ORDER_STATUSES.delivering, to: ORDER_STATUSES.delivered }
	]
}
