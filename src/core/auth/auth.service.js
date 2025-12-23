import { errorHandler } from '../error/index.js'
import bcrypt from 'bcrypt'
import { createAuthRepo, findOneAuthRepo, destroyManySessionsRepo } from './auth.repository.js'
import config from '../../config/index.js'

export const findOneAuthSrvc = async ({ match, select }) => {
	return await findOneAuthRepo({ match, select })
}

export const createAuthSrvc = async ({ user, password }) => {
	try {
		const salt = bcrypt.genSaltSync(config.auth.saltRounds)
		password = bcrypt.hashSync(password, salt)
		const createdAuth = await createAuthRepo({ user, password })
		return createdAuth
	} catch (err) {
		errorHandler({ err })
	}
}

export const destroyUserSessionsSrvc = async ({ userId }) => {
	try {
		console.log('Destroying sessions for userId=', userId)
		const destroyedSessions = await destroyManySessionsRepo({ userId })
		return destroyedSessions
	} catch (err) {
		errorHandler({ err })
	}
}
