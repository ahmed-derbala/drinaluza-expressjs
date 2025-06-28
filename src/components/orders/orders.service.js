const { errorHandler } = require('../../core/error')
const { log } = require('../../core/log')
const config = require(`../../config`)
const { findOneOrderRepo, findManyOrdersRepo, createdOrderRepo } = require('./orders.repository')
const { findOneProductSrvc } = require('../products/products.service')

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
		console.log(data)
		//process products
		console.log('before loop')
		for (p of data.products) {
			console.log(p)
			const x = await findOneProductSrvc({ match: { _id: p.product._id } })
			console.log('x', x)
			p.product = x
			console.log(p)

			console.log('loop end')
		}
		console.log('after loop')
		const createdOrder = await createdOrderRepo({ data })

		return createdOrder
	} catch (err) {
		throw errorHandler({ err })
	}
}
