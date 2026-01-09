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
		const fetchedAuth = await AuthModel.findOne({ 'user.slug': match.slug }).select(select).lean()
		return fetchedAuth
	} catch (err) {
		errorHandler({ err })
	}
}

export const destroySessionsRepo = async ({ user }) => {
	const destroyedSessions = await SessionsModel.deleteMany({ 'user._id': user._id })
	log({ message: `Destroyed ${destroyedSessions.deletedCount} sessions for user.slug=${user.slug}`, level: 'info' })
	return destroyedSessions
}
