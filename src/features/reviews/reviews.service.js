import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import { createReviewRepo, findOneReviewRepo, findReviewsRepo, updateReviewRepo, deleteReviewRepo } from './reviews.repository.js'

export const createReviewSrvc = async ({ stars, comment, author, targetId, targetResource, targetData }) => {
	return createReviewRepo({ stars, comment, author, targetId, targetResource, targetData })
}

export const findOneReviewSrvc = async ({ match, select }) => {
	return findOneReviewRepo({ match, select })
}

export const findReviewsSrvc = async ({ match, select, page, limit, count }) => {
	if (!match || !match.targetId || !match.targetResource) {
		return errorHandler({ err: { message: 'match.targetId and match.targetResource are required' } })
	}

	return findReviewsRepo({ match, select, page, limit, count })
}

export const updateReviewSrvc = async ({ match, update }) => {
	return updateReviewRepo({ match, update })
}

export const deleteReviewSrvc = async ({ match }) => {
	return deleteReviewRepo({ match })
}
