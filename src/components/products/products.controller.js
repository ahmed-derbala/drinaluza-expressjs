const express = require('express')
const router = express.Router()
const { authenticate } = require(`../../core/auth`)
const { findOneDefaultProductSrvc } = require('../default-products/default-products.service.js')
router
	.route('/', () => {})
	.get(() => {})
	.post(async (req, res) => {
		const { defaultProduct } = req.body
		//fetch defaultProduct
	})

module.exports = router
