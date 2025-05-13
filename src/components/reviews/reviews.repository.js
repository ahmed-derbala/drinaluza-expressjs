const { ReviewsModel } = require(`./reviews.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { log } = require('../../core/log')

module.exports.findOneRatingRepo = async ({ filter, select }) => {
	try {
		const rating = await ReviewsModel.findOne(filter).select(select).lean()
		return rating
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.createReviewRepo = async ({ story, value, userId, identityId }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const review = await ReviewsModel.create({ story, value, userId, identityId })
			resolve(review)
		} catch (err) {
			//reject(errorHandler({ err }))
			reject(err)
		}
	})
}

module.exports.updateCurrentValueRepo = async ({ currentValue, userId, reputationId }) => {
	try {
		const history = [{ value: currentValue, createdAt: Date.now() }]
		const rating = await ReviewsModel.create({ userId, reputationId, history })
		return rating
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.updateRatingCurrentValueRepo = async ({ ratingId, newCurrentValue, oldCurrentValue }) => {
	try {
		let newHistoryItem = { value: oldCurrentValue, createdAt: Date.now() }
		const updatedRatingInfos = ReviewsModel.updateOne(
			{
				_id: ratingId
			},
			{
				currentValue: newCurrentValue,
				$push: { history: newHistoryItem }
			}
		)
		return updatedRatingInfos
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.findReviewsRepo = async ({ match, select, page, limit }) => {
	try {
		let paginateMongodbOptions = { match, select, page, limit, populate: 'identityId', model: ReviewsModel }
		/*if (searchText) {
			paginateMongodbOptions.match = { 'facebook.id': { $regex: searchText, $options: 'i' } }
		}*/
		return paginateMongodb(paginateMongodbOptions)
	} catch (err) {
		return errorHandler({ err })
	}
}
