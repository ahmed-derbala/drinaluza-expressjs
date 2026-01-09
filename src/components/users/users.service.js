import { UserModel } from './users.schema.js'
import { errorHandler } from '../../core/error/index.js'
import mongoose from 'mongoose'
import { log } from '../../core/log/index.js'
import { createUserRepo, findOneUserRepo, updateUserRepo, addShopToUserRepo, findMyProfileRepo, updateMyProfileRepo, findUsersRepo } from './users.repository.js'
import { createBusinessSrvc } from '../businesses/businesses.service.js'

export const updateMyProfileSrvc = async ({ userId, newData }) => {
	try {
		const updatedMyProfile = await updateMyProfileRepo({ userId, newData })
		return updatedMyProfile
	} catch (err) {
		errorHandler({ err })
	}
}

export const findMyProfileSrvc = async ({ userId }) => {
	try {
		const myProfile = await findMyProfileRepo({ userId })
		return myProfile
	} catch (err) {
		errorHandler({ err })
	}
}

export const findOneUserSrvc = async ({ match, select }) => {
	try {
		//log({ level: 'debug', data: { match, select } })
		const fetchedUser = await findOneUserRepo({ match, select })
		return fetchedUser
	} catch (err) {
		errorHandler({ err })
	}
}

export const findUsersSrvc = async ({ match, select, page, limit, count }) => {
	//log({ level: 'debug', data: { match, select } })
	return await findUsersRepo({ match, select, page, limit, count })
}

export const findOneProfileSrvc = async ({ slug }) => {
	try {
		findUsersRepo
		if (!loginId) loginId = userId
		let $or = [{ email: loginId }, { slug: loginId }, { 'phone.shortNumber': loginId }]
		if (mongoose.isValidObjectId(loginId)) $or.push({ _id: loginId })
		return UserModel.findOne({ $or }).select('+profile').lean()
	} catch (err) {
		errorHandler({ err })
	}
}

export const updateUserSrvc = async ({ match, newData }) => {
	return await updateUserRepo({ match, newData })
}

export const createUserSrvc = async ({ email, slug, name, phone, profile, settings, role }) => {
	if (!slug && !name) return null
	const user = await createUserRepo({ email, slug, name, phone, profile, settings, role })
	if (!user) return null
	if (user.role === 'shop_owner') {
		const business = await createBusinessSrvc({ owner: user })
		await addBusinessToUserSrvc({ business, user })
	}
	return user
}

export const addShopToUserSrvc = async ({ shop, userId }) => {
	try {
		const updatedUser = await addShopToUserRepo({ shop, userId })
		return updatedUser
	} catch (err) {
		errorHandler({ err })
	}
}

export const addBusinessToUserSrvc = async ({ business, user }) => {
	return await updateUserRepo({ match: { _id: user._id }, newData: { business } })
}
