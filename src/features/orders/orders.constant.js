export const ORDER_KINDS = {
	TABLE: 'table',
	TAKEAWAY: 'takeaway',
	PICKUP: 'pickup'
}

export const ORDER_KINDS_ALL = () => Object.values(ORDER_KINDS)

export const ORDER_STATUSES = {
	PENDING_BUSINESS_CONFIRMATION: 'pending_business_confirmation',
	PENDING_CUSTOMER_CONFIRMATION: 'pending_customer_confirmation',
	CONFIRMED_BY_BUSINESS: 'confirmed_by_business',
	READY_FOR_PICKUP_BY_CUSTOMER: 'ready_for_pickup_by_customer',
	PREPARING: 'preparing',
	RESERVATION_EXPIRED: 'reservation_expired',
	DELIVERING_TO_CUSTOMER: 'delivering_to_customer',
	DELIVERED_TO_CUSTOMER: 'delivered_to_customer',
	RECEIVED_BY_CUSTOMER: 'received_by_customer',
	CANCELLED_BY_CUSTOMER: 'cancelled_by_customer',
	CANCELLED_BY_BUSINESS: 'cancelled_by_business'
}
export const ORDER_STATUSES_ALL = () => Object.values(ORDER_STATUSES)
