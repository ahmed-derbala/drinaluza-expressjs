const express = require('express')
const router = express.Router()
const { resp } = require('../../core/helpers/resp')
const { findManyProductSrvc, createProductSrvc } = require('./products.service')
const { errorHandler } = require('../../core/error')
const { authenticate } = require(`../../core/auth`)

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
	.post(authenticate(), async (req, res) => {
		try {
			const createdByUser = req.user
			const { business, shops, name } = req.body
			const data = { business, shops, createdByUser, name }
			const createdProduct = await createProductSrvc({ data })
			//console.log(createdProduct)
			return resp({ status: 201, data: createdProduct, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})

module.exports = router
