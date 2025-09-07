import { UserModel } from './users.schema.js'
import { errorHandler } from '../../core/error/index.js'
import mongoose from 'mongoose'
import { log } from '../../core/log/index.js'
import { createUserRepo, findOneUserRepo, updateUserRepo, addShopToUserRepo } from './users.repository.js'

export const findOneUserSrvc = async ({ match, select }) => {
	try {
		//log({ level: 'debug', data: { match, select } })
		const fetchedUser = await findOneUserRepo({ match, select })
		return fetchedUser
	} catch (err) {
		errorHandler({ err })
	}
}
export const getUsers = async (params) => {
	return paginate({ model: UserModel })
		.then((users) => {
			return users
		})
		.catch((err) => errorHandler({ err }))
}
export const getProfile = async ({ loginId, userId, req }) => {
	try {
		log({ message: `requesting profile of userId=${userId} ...`, level: 'debug', req })
		if (!loginId) loginId = userId
		let $or = [{ email: loginId }, { slug: loginId }, { 'phone.shortNumber': loginId }]
		if (mongoose.isValidObjectId(loginId)) $or.push({ _id: loginId })
		return UserModel.findOne({ $or }).select('+profile').lean()
	} catch (err) {
		errorHandler({ err })
	}
}
export const updateUserSrvc = async ({ identity, newData }) => {
	try {
		const updatedUser = await updateUserRepo({ identity, newData })
		return updatedUser
	} catch (err) {
		errorHandler({ err })
	}
}

export const createUserSrvc = async ({ email, slug, phone, settings }) => {
	const signedupUser = await createUserRepo({ email, slug, phone, settings })
	if (!signedupUser) return null
	return signedupUser
}

export const addShopToUserSrvc = async ({ shop, userId }) => {
	try {
		const updatedUser = await addShopToUserRepo({ shop, userId })
		return updatedUser
	} catch (err) {
		errorHandler({ err })
	}
}
