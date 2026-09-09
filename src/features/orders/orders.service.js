import { findOrdersRepo, findBusinessCustomersRepo } from './orders.repository.js'
import { PERMITTED_ORDERS_TRANSITIONS } from './orders.constant.js'
export const findOrdersSrvc = async ({ match, page, limit }) => {
	page = parseInt(page, 10)
	limit = parseInt(limit, 10)
	return findOrdersRepo({ match, page, limit })
}

export const findBusinessCustomersSrvc = async ({ match, select, page, limit }) => {
	//return findOrdersRepo({ match, select, page, limit })
	return findBusinessCustomersRepo({ match, select, page, limit })
}

export const isValidStatusTransitionSrvc = ({ oldStatus, newStatus, role }) => {
	if (!oldStatus || !newStatus || !role) return false
	if (oldStatus === newStatus) return true
	const allowed = PERMITTED_ORDERS_TRANSITIONS[role] || []
	return allowed.some((t) => t.from === oldStatus && t.to === newStatus)
}
