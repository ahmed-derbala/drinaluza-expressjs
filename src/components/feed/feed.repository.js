import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { FeedModel } from './feed.schema.js'

export const createFeedRepo = async ({ targetData, targetResource, card }) => {
	return FeedModel.create({ targetData, targetResource, card })
}

export const findFeedRepo = async ({ match, select, page, limit }) => {
	return paginateMongodb({ model: FeedModel, match, select, page, limit, sort: { score: -1, updatedAt: -1, createdAt: -1 } })
}
