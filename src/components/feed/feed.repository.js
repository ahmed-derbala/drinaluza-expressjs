import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { FeedModel } from './feed.schema.js'
import { flattenObject } from '../../core/helpers/filters.js'
import { log } from '../../core/log/index.js'

export const createFeedRepo = async ({ targetData, targetResource, targetId, card }) => {
	return FeedModel.create({ targetData, targetResource, targetId, card })
}

export const findFeedRepo = async ({ match, select, page, limit }) => {
	return paginateMongodb({ model: FeedModel, match, select, page, limit, sort: { score: -1, updatedAt: -1, createdAt: -1 } })
}

export const updateOneCardFeedRepo = async ({ match, newData }) => {
	const flattenedMatch = flattenObject(match)
	match = { ...flattenedMatch }
	const updateFields = {}
	for (const key in newData) {
		updateFields[`targetData.${key}`] = newData[key]
	}
	log({ level: 'debug', message: 'updateOneCardFeedRepo', data: { match, newData } })
	return FeedModel.findOneAndUpdate(match, { $set: updateFields }, { returnDocument: 'after' })
}

export const updateCardsFeedRepo = async ({ match, newData }) => {
	const flattenedMatch = flattenObject(match)
	match = { ...flattenedMatch }
	const updateFields = {}
	for (const key in newData) {
		updateFields[`targetData.${key}`] = newData[key]
	}
	log({ level: 'debug', message: 'updateCardsFeedRepo', data: { match, newData } })
	return FeedModel.updateMany(match, { $set: updateFields })
}
