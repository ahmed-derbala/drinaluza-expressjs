import { ReviewModel } from './reviews.schema.js'
import { flattenObject } from '../../core/helpers/filters.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'

export const createReviewRepo = async ({ stars, comment, author, targetId, targetResource, targetData }) => {
	return ReviewModel.create({ stars, comment, author, targetId, targetResource, targetData })
}

export const findOneReviewRepo = async ({ match, select }) => {
	return ReviewModel.findOne(match).select(select)
}

export const findReviewsRepo = async ({ match, select, page, limit, count }) => {
	const flattenedMatch = flattenObject(match)
	match = { ...flattenedMatch }
	if (count) {
		const reviewsCount = await ReviewModel.countDocuments(match)
		return reviewsCount
	}
	log({ level: 'debug', message: 'findReviewsRepo', data: flattenedMatch })
	return paginateMongodb({ model: ReviewModel, match: { ...flattenedMatch }, select, page, limit })
}

export const updateReviewRepo = async ({ match, update }) => {
	return ReviewModel.findOneAndUpdate(match, update, { new: true })
}

export const deleteReviewRepo = async ({ match }) => {
	return ReviewModel.deleteOne(match)
}
