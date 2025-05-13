const express = require('express')
const router = express.Router()
const { authenticate } = require(`../../core/auth`)
const { errorHandler } = require('../../core/utils/error')
const { patchRatingVld, createReviewVld } = require('./reviews.validator')
const { validate } = require('../../core/validation')
const { updateRatingCurrentValueSrvc, createReviewSrvc, findReviews } = require('./reviews.service')
const { resp } = require('../../core/helpers/resp')
const { log } = require('../../core/log')
const { ratingNotFoundTrns } = require('./reviews.transalation')
const { findOneIdentitySrvc, createIdentitySrvc } = require('../identities/identities.service')

router.post('/create', authenticate(), validate(createReviewVld), async (req, res) => {
	try {
		const { story, value, identityId } = req.body
		let identity = await findOneIdentitySrvc({ match: { _id: identityId }, select: '_id' })
		if (!identity) {
			return resp({ status: 409, label: 'identity_not_found', message: `identity with _id=${identityId} not found`, data: null, req, res })
		}

		const review = await createReviewSrvc({ story, userId: req.user._id, value, identityId })
		return resp({ status: 200, data: review, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.patch('/', validate(patchRatingVld), authenticate(), async (req, res) => {
	try {
		const ratingIsUpdated = await updateRatingCurrentValueSrvc({
			userId: req.user._id,
			currentValue: req.body.currentValue,
			reputationId: req.body.reputationId
		})

		if (!ratingIsUpdated) {
			return resp({ status: 400, data: null, message: ratingNotFoundTrns({ lang: req.user.settings?.lang }), req, res })
		}
		// return resp({ status: 400, json: {data:null,message:ratingIsUpdated}, req, res })
	} catch (err) {
		//reject(errorHandler({ err, req, res }))
		errorHandler({ err, req, res })
	}
	//})
})

router.post('/find', authenticate(), async (req, res) => {
	try {
		const { page, limit } = req.query
		let { match, select } = req.body
		//by default fetch reviews with stories
		if (!match) match = {}
		if (!match.story) match.story = { $exists: true }
		const reviews = await findReviews({ match, select, page, limit })
		return resp({ status: 200, data: reviews, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})
module.exports = router
