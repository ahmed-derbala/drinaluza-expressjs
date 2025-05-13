const express = require('express')
const router = express.Router()
const { errorHandler } = require('../../core/utils/error')
const { findReviewsSrvc } = require('../reviews/reviews.service')
const { resp } = require('../../core/helpers/resp')

router.get('/', async (req, res) => {
	try {
		const { page, limit } = req.query
		const reviews = await findReviewsSrvc({ page, limit })
		return resp({ status: 200, data: reviews, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

module.exports = router
