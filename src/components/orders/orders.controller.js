const express = require('express')
const router = express.Router()
const { resp } = require('../../core/helpers/resp')
const { findManyOrdersSrvc, createOrderSrvc } = require('./orders.service')
const { errorHandler } = require('../../core/error')
const { authenticate } = require(`../../core/auth`)
const { createOrderVld } = require('./orders.validator')
const { validate } = require('../../core/validation')

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
			const { shop, products } = req.body

			let { business } = req.body

			const data = { createdByUser, business, shop, products }
			const createdOrder = await createOrderSrvc({ data })
			//console.log(createdOrder)
			return resp({ status: 201, data: createdOrder, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})

module.exports = router
