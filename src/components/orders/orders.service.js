const { errorHandler } = require('../../core/error')
const { log } = require('../../core/log')
const config = require(`../../config`)
const { findOneOrderRepo, findManyOrdersRepo, createdOrderRepo } = require('./orders.repository')

module.exports.findOneOrderSrvc = async ({ match, select }) => {
	const fetchedOrder = await findOneOrderRepo({ match, select })
}

module.exports.findManyOrdersSrvc = async ({ match, select, page, limit }) => {
	try {
		page = parseInt(page, 10)
		limit = parseInt(limit, 10)
		const fetchedManyOrders = await findManyOrdersRepo({ match, select, page, limit })
		return fetchedManyOrders
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.createOrderSrvc = async ({ data }) => {
	try {
		const createdOrder = await createdOrderRepo({ data })
		return createdOrder
	} catch (err) {
		throw errorHandler({ err })
	}
}
