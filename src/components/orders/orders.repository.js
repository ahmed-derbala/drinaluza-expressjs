const { OrderModel } = require(`./orders.schema`)
const { errorHandler } = require('../../core/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { log } = require(`../../core/log`)
const { flattenObject } = require('../../core/helpers/filters')

module.exports.findOneOrderRepo = async ({ match, select }) => {
	try {
		const flattenedMatch = flattenObject({ obj: match })
		const fetchedOrder = await OrderModel.findOne({ ...flattenedMatch })
			.select(select)
			.lean()
		return fetchedOrder
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.findManyOrdersRepo = async ({ match, select, page, limit }) => {
	try {
		const flattenedMatch = flattenObject({ obj: match })
		const fetchedManyOrders = paginateMongodb({ model: OrderModel, match: { ...flattenedMatch }, select, page, limit })
		return fetchedManyOrders
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.createdOrderRepo = async ({ data }) => {
	try {
		const createdOrder = await OrderModel.create({ ...data })
		console.log(createdOrder)
		return createdOrder
	} catch (err) {
		throw errorHandler({ err })
	}
}
