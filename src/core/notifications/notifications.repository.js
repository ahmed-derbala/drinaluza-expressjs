import { NotificationModel } from './notifications.schema.js'
import { errorHandler } from '../error/index.js'
import { flattenObject } from '../helpers/filters.js'
import { paginateMongodb } from '../db/mongodb/pagination.js'

export const createNotificationRepo = async ({ user, template, kind, title, content }) => {
	return NotificationModel.create({ user, template, kind, title, content })
}

export const findNotificationsRepo = async ({ match, page, limit }) => {
	try {
		const flattenedMatch = flattenObject(match)
		return paginateMongodb({ model: NotificationModel, match: flattenedMatch, page, limit })
	} catch (err) {
		errorHandler({ err })
	}
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
		return await NotificationModel.findOneAndUpdate(flattenedMatch, { $set: newData }, { new: true })
	} catch (err) {
		errorHandler({ err })
	}
}
