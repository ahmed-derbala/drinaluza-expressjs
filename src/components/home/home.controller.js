const express = require('express')
const router = express.Router()
const { resp } = require('../../core/helpers/resp')
const { findManyProductSrvc } = require('../products/products.service')
const { errorHandler } = require('../../core/error')
const { makeHomeCards } = require('./home.helper')
router
	.route('/')
	.get(async (req, res) => {
		try {
			const { match, select } = req.body || {}
			let { page = 1, limit = 10 } = req.query

			const products = await findManyProductSrvc({ match, select, page, limit })
			//const homeCards = makeHomeCards({ products: products.data })
			//return res.send(homeCards)
			return resp({ status: 200, data: products, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(() => {})

module.exports = router
