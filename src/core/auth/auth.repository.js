import { AuthModel } from './auth.schema.js'
import { errorHandler } from '../error/index.js'
import { paginateMongodb } from '#mongodb'
import { log } from '../log/index.js'
import { SessionModel } from '../sessions/sessions.schema.js'

export const createAuthRepo = async ({ user, password }) => {
	return AuthModel.create({ user, password })
}
export const findOneAuthRepo = async ({ match, select, populate }) => {
	let fetchedAuth = await AuthModel.findOne({ 'user.slug': match.slug }).select(select).populate(populate).lean()
	if (populate) {
		fetchedAuth.user = { ...fetchedAuth.user._id }
	}
	return fetchedAuth
}

export const destroySessionsRepo = async ({ user }) => {
	const destroyedSessions = await SessionModel.deleteMany({ 'user._id': user._id })
	log({ message: `Destroyed ${destroyedSessions.deletedCount} sessions for user.slug=${user.slug}`, level: 'info' })
	return destroyedSessions
}
