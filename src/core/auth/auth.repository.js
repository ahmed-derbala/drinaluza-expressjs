import { AuthModel } from './auth.schema.js'
import { errorHandler } from '../error/index.js'
import { paginateMongodb } from '../db/mongodb/pagination.js'
import { log } from '../log/index.js'
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
