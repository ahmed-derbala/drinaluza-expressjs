import { UserModel } from './users.schema.js'
import { errorHandler } from '../../core/error/index.js'
import mongoose from 'mongoose'
import { log } from '../../core/log/index.js'
import { createUserRepo, findOneUserRepo, updateUserRepo, addShopToUserRepo, findMyProfileRepo, updateMyProfileRepo, findUsersRepo } from './users.repository.js'
import { createBusinessSrvc } from '../businesses/businesses.service.js'

export const updateMyProfileSrvc = async ({ userId, newData }) => {
	return updateMyProfileRepo({ userId, newData })
}

export const findMyProfileSrvc = async ({ userId }) => {
	const select = '+basicInfos +settings +address +location +contact'
	return findMyProfileRepo({ userId, select })
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

export const findOneProfileSrvc = async ({ match }) => {
	const select = '+basicInfos +address'
	return findOneUserRepo({ match, select })
}

export const updateUserSrvc = async ({ match, newData }) => {
	return await updateUserRepo({ match, newData })
}

export const createUserSrvc = async ({ email, slug, name, phone, profile, settings, role, address }) => {
	if (!slug && !name) return null
	const user = await createUserRepo({ email, slug, name, phone, profile, settings, role, address })
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
