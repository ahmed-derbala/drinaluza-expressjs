import { errorHandler } from '../error/index.js'
import bcrypt from 'bcrypt'
import { createAuthRepo, findOneAuthRepo } from './auth.repository.js'
import config from '../../config/index.js'
const findOneAuthSrvc = async ({ match, select }) => {
	try {
		const fetchedAuth = await findOneAuthRepo({ match, select })
		return fetchedAuth
	} catch (err) {
		errorHandler({ err })
	}
}
export const signinSrvc = async ({ match, password }) => {
	try {
		const fecthedAuth = await findOneAuthSrvc({ match, select: '+password' })
		if (!fecthedAuth) {
			if (config.NODE_ENV === 'production') return { message: 'loginId or password is not correct', data: null, status: 409 }
			return { message: 'no user found with that loginId', data: null, status: 409 }
		}
		//user found, check password
		const passwordCompare = bcrypt.compareSync(password, fecthedAuth.password)
		delete fecthedAuth.password //we dont need password anymore
		if (passwordCompare == false) {
			if (config.NODE_ENV === 'production') return { message: 'loginId or password is not correct', data: null, status: 409 }
			return { message: 'password incorrect', data: null, status: 409 }
		}
		return fecthedAuth
	} catch (err) {
		errorHandler({ err })
	}
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
export { findOneAuthSrvc }
