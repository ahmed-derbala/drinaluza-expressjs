import { findOrdersRepo } from './orders.repository.js'

export const findOrdersSrvc = async ({ match, page, limit }) => {
	page = parseInt(page, 10)
	limit = parseInt(limit, 10)
	return findOrdersRepo({ match, page, limit })
}

export const findBusinessCustomersSrvc = async ({ match, select, page, limit }) => {
	return findOrdersRepo({ match, select, page, limit })
}
