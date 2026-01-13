import { UserModel } from './users.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'

export const updateMyProfileRepo = async ({ user, newData }) => {
	return UserModel.findOneAndUpdate({ slug: user.slug }, { $set: newData }, { new: true }).select('+address +location +basicInfos +settings +contact +socialMedia +media')
}

export const updateUserRepo = async ({ match, newData }) => {
	return await UserModel.findOneAndUpdate(match, { $set: newData }, { new: true })
}

export const findMyProfileRepo = async ({ user, select }) => {
	//log({ level: 'debug', message: 'findMyProfileRepo', data: { user, select } })
	return UserModel.findOne({ slug: user.slug }).select(select).lean()
}

export const findOneUserRepo = async ({ match, select }) => {
	return UserModel.findOne(match).select(select).lean()
}

export const findUsersRepo = async ({ match, select, page, limit, count }) => {
	try {
		if (count) {
			const usersCount = await UserModel.countDocuments(match)
			return usersCount
		}
		return await paginateMongodb({ model: UserModel, match, select, page, limit })
	} catch (err) {
		return errorHandler({ err })
	}
}

export const createUserRepo = async ({ slug, name, role, contact, address, location, settings, media, socialMedia, basicInfos }) => {
	let updateData = {}
	if (!name) {
		name = {}
		name.en = slug
		updateData.name = name
	}
	let singedupUser = await UserModel.create({ slug, name, role, contact, address, location, settings, media, socialMedia, basicInfos })
	if (!slug) {
		slug = singedupUser._id
		updateData.slug = slug
	}
	if (Object.keys(updateData).length > 0) {
		await UserModel.updateOne({ _id: singedupUser._id }, updateData)
	}
	return singedupUser
}

export const addShopToUserRepo = async ({ shop, userId }) => {
	try {
		const updatedUser = await UserModel.updateOne({ _id: userId }, { $push: { shops: shop } })
		log({ level: 'debug', message: 'addShopToUserRepo', data: updatedUser })
		return updatedUser
	} catch (err) {
		return errorHandler({ err })
	}
}
