const express = require('express')
const router = express.Router()
const { resp } = require('../../core/helpers/resp')
const { findManyProductSrvc } = require('./products.service')
const { errorHandler } = require('../../core/error')

router
	.route('/')
	.get(async (req, res) => {
		try {
			const { match, select } = req.body || {}
			let { page = 1, limit = 10 } = req.query

			const fetchedManyProduct = await findManyProductSrvc({ match, select, page, limit })
			return resp({ status: 200, data: fetchedManyProduct, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(() => {})

module.exports = router
