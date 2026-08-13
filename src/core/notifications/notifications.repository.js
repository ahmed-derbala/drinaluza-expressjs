import { NotificationModel } from './notifications.schema.js'
import { errorHandler } from '../error/index.js'
import { flattenObject } from '../helpers/filters.js'
import { paginateMongodb } from '../db/mongodb/pagination.js'

export const createNotificationRepo = async ({ user, template, screen, title, content, kind, priority, media }) => {
	return NotificationModel.create({ user, screen, template, kind, title, content, priority, media })
}

export const findNotificationsRepo = async ({ match, page, limit }) => {
	const userId = match.user._id
	delete match.user
	match['user._id'] = userId
	return paginateMongodb({ model: NotificationModel, match, page, limit })
}

export const findOneNotificationRepo = async ({ match }) => {
	try {
		const flattenedMatch = flattenObject(match)
		return await NotificationModel.findOne(flattenedMatch).lean()
	} catch (err) {
		return errorHandler({ err })
	}
}

export const updateOneNotificationRepo = async ({ match, newData }) => {
	try {
		const flattenedMatch = flattenObject(match)
		return await NotificationModel.findOneAndUpdate(flattenedMatch, { $set: newData }, { returnDocument: 'after' })
	} catch (err) {
		errorHandler({ err })
	}
}
