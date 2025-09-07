import { UserModel } from './users.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'
export const updateUserRepo = async ({ identity, newData }) => {
	try {
		const updatedUser = await UserModel.updateOne(identity, newData)
		return updatedUser
	} catch (err) {
		errorHandler({ err })
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
export const createUserRepo = async ({ email, slug, name, phone, password, profile, settings }) => {
	try {
		let singedupUser = await UserModel.create({ email, slug, phone, password, settings })
		let updateData = {}
		if (!slug) {
			slug = singedupUser._id
			updateData.slug = slug
		}
		if (!name) {
			name = slug
			updateData.name = name
		}
		if (updateData) await UserModel.updateOne({ _id: singedupUser._id }, updateData)
		singedupUser = singedupUser.toJSON()
		delete singedupUser.password
		//console.log(singedupUser)
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
