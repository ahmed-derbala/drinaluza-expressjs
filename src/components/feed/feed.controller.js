const express = require('express')
const router = express.Router()
const { resp } = require('../../core/helpers/resp')
const { findManyProductsSrvc } = require('../products/products.service')
const { errorHandler } = require('../../core/error')
const { makeFeedCards } = require('./feed.helper')
const { cardTypeEnum } = require('./feed.enum')

router
	.route('/')
	.get(async (req, res) => {
		try {
			const { match, select } = req.body || {}
			let { page = 1, limit = 10 } = req.query

			let products = await findManyProductsSrvc({ match, select, page, limit })
			products.data = products.data.map((p) => {
				p.card = {
					type: cardTypeEnum.product
				}
				return p
			})
			return resp({ status: 200, data: products, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(() => {})

module.exports = router
