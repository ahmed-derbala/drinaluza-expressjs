const { errorHandler } = require('../../core/utils/error')
const { findOneIdentitySrvc } = require('../identities/identities.service')
const { findOneRatingRepo, updateRatingCurrentValueRepo, findReviewsRepo, createReviewRepo } = require('./reviews.repository')
const { log } = require('../../core/log')

module.exports.createReviewSrvc = async ({ story, userId, value, identityId }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const review = await createReviewRepo({ story, userId, value, identityId })
			console.log({ review })
			return resolve(review)
		} catch (err) {
			reject(errorHandler({ err }))
		}
	})
}

module.exports.updateRatingCurrentValueSrvc = async ({ currentValue, userId, reputationId }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const fetchedRating = await findOneRatingRepo({ reputationId, userId })
			if (!fetchedRating) {
				log({ level: 'warn', message: `no rating found with ${JSON.stringify({ userId, reputationId })}` })
				return resolve(null)
			}

			const updatedRatingInfos = await updateRatingCurrentValueRepo({ ratingId, newCurrentValue: currentValue, oldCurrentValue: fetchedRating.currentValue })
			resolve(updatedRatingInfos)
		} catch (err) {
			reject(errorHandler({ err }))
		}
	})
}

module.exports.findReviewsSrvc = async ({ match, select, page, limit, populate }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const fetchedReviews = await findReviewsRepo({ match, select, page, limit, populate })
			return resolve(fetchedReviews)
		} catch (err) {
			reject(errorHandler({ err }))
		}
	})
}
