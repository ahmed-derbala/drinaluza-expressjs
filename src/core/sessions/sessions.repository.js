import { SessionModel } from './sessions.schema.js'
import { formatMongoQuery } from '#mongodb'
import { log } from '../log/index.js'

/*
export const createNotificationRepo = async ({ user, template, kind, title, content }) => {
	return NotificationModel.create({ user, template, kind, title, content })
}*/

export const findSessionsRepo = async ({ match, select }) => {
	//log({ level: 'debug', message: 'findSessionsRepo', data: { match, select } })
	//const flattenedMatch = formatMongoQuery(match)
	//console.log('flattenedMatch', flattenedMatch)
	return SessionModel.find(match).select(select)
}

export const findOneSessionRepo = async ({ match }) => {
	//log({ level: 'debug', message: 'findOneSessionRepo', data: { match } })
	const flattenedMatch = formatMongoQuery(match)
	return SessionModel.findOne(flattenedMatch)
}
/*
export const findOneNotificationRepo = async ({ match }) => {
	try {
		const flattenedMatch = formatMongoQuery(match)
		return await NotificationModel.findOne(flattenedMatch).lean()
	} catch (err) {
		return errorHandler({ err })
	}
}

export const updateOneNotificationRepo = async ({ match, newData }) => {
	try {
		const flattenedMatch = formatMongoQuery(match)
		return await NotificationModel.findOneAndUpdate(flattenedMatch, { $set: newData }, { returnDocument: 'after' })
	} catch (err) {
		errorHandler({ err })
	}
}
*/
