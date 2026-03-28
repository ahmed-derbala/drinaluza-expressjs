import { SessionModel } from './sessions.schema.js'
import { flattenObject } from '../helpers/filters.js'
import { log } from '../log/index.js'

/*
export const createNotificationRepo = async ({ user, template, kind, title, content }) => {
	return NotificationModel.create({ user, template, kind, title, content })
}*/

export const findSessionsRepo = async ({ match, select }) => {
	log({ level: 'debug', message: 'findSessionsRepo', data: { match, select } })
	const flattenedMatch = flattenObject(match)
	return SessionModel.find(flattenedMatch).select(select)
}
export const findOneSessionRepo = async ({ match }) => {
	log({ level: 'debug', message: 'findOneSessionRepo', data: { match } })
	const flattenedMatch = flattenObject(match)
	return SessionModel.findOne(flattenedMatch)
}
/*
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
*/
