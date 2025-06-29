const express = require('express')
const router = express.Router()
const { resp } = require('../../core/helpers/resp')
const { findManyOrdersSrvc, createOrderSrvc } = require('./orders.service')
const { errorHandler } = require('../../core/error')
const { authenticate } = require(`../../core/auth`)
const { createOrderVld } = require('./orders.validator')
const { validate } = require('../../core/validation')
const { findOneProductSrvc } = require('../products/products.service')

router
	.route('/')
	.get(async (req, res) => {
		try {
			const { match, select } = req.body || {}
			let { page = 1, limit = 10 } = req.query

			const fetchedManyOrders = await findManyOrdersSrvc({ match, select, page, limit })
			return resp({ status: 200, data: fetchedManyOrders, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(authenticate(), validate(createOrderVld), async (req, res) => {
		try {
			const createdByUser = req.body?.createdByUser || req.user
			const { products } = req.body
			//process products
			for (p of products) {
				p = await findOneProductSrvc({ match: { _id: p.product._id } })
			}
			const business = products[0].product.business
			const shop = products[0].product.shop
			const data = { createdByUser, business, shop, products }
			//console.log('data',data)
			const createdOrder = await createOrderSrvc({ data })
			//console.log(createdOrder)
			return resp({ status: 201, data: createdOrder, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})

module.exports = router
