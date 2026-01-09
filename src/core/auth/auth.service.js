import { errorHandler } from '../error/index.js'
import bcrypt from 'bcrypt'
import { createAuthRepo, findOneAuthRepo, destroySessionsRepo } from './auth.repository.js'
import config from '../../config/index.js'
import { log } from '../log/index.js'

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

export const destroyUserSessionsSrvc = async ({ user }) => {
	log({ level: 'debug', message: `Destroying sessions for user.slug=${user.slug}` })
	return destroySessionsRepo({ user })
}
