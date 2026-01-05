import { UserModel } from './users.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'

export const updateMyProfileRepo = async ({ userId, newData }) => {
	try {
		const updatedMyProfile = await UserModel.findByIdAndUpdate(userId, { $set: newData }, { new: true }).select('+address +basicInfos +settings')
		return updatedMyProfile
	} catch (err) {
		errorHandler({ err })
	}
}

export const updateUserRepo = async ({ match, newData }) => {
	try {
		const updatedUser = await UserModel.findOneAndUpdate(match, { $set: newData }, { new: true })
		console.log(updatedUser, 'updatedUser')
		return updatedUser
	} catch (err) {
		errorHandler({ err })
	}
}

export const findMyProfileRepo = async ({ userId }) => {
	try {
		const myProfile = await UserModel.findOne({ _id: userId }).select('+basicInfos +settings +address +location').lean()
		return myProfile
	} catch (err) {
		return errorHandler({ err })
	}
}

export const findOneUserRepo = async ({ match, select }) => {
	try {
		const user = await UserModel.findOne(match).select(select).lean()
		//console.log(user,match)
		return user
	} catch (err) {
		return errorHandler({ err })
	}
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

export const createUserRepo = async ({ email, slug, name, phone, profile, settings, role }) => {
	try {
		let singedupUser = await UserModel.create({ email, slug, name, phone, profile, settings, role })
		let updateData = {}
		if (!slug) {
			slug = singedupUser._id
			updateData.slug = slug
		}
		if (!name) {
			name = slug
			updateData.name = name
		}
		if (Object.keys(updateData).length > 0) {
			await UserModel.updateOne({ _id: singedupUser._id }, updateData)
		}
		return singedupUser
	} catch (err) {
		errorHandler({ err })
	}
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
