import { AuthModel } from './auth.schema.js'
import { errorHandler } from '../error/index.js'
import { paginateMongodb } from '../db/mongodb/pagination.js'
import { log } from '../log/index.js'
import { SessionsModel } from './sessions.schema.js'
export const createAuthRepo = async ({ user, password }) => {
	try {
		const createdAuth = await AuthModel.create({ user, password })
		return createdAuth
	} catch (err) {
		errorHandler({ err })
	}
}
export const findOneAuthRepo = async ({ match, select }) => {
	try {
		const fetchedAuth = await AuthModel.findOne({ 'user.slug': match.user.slug }).select(select).lean()
		return fetchedAuth
	} catch (err) {
		errorHandler({ err })
	}
}

export const destroyManySessionsRepo = async ({ userId }) => {
	try {
		const destroyedSessions = await SessionsModel.deleteMany({ 'user._id': userId })
		log({ message: `Destroyed ${destroyedSessions.deletedCount} sessions for userId=${userId}`, level: 'info' })
		return destroyedSessions
	} catch (err) {
		errorHandler({ err })
	}
}
