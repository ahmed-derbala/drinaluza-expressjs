const { UsersModel } = require(`./users.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { log } = require(`../../core/log`)

module.exports.updateUserRepo = async ({ identity, newData }) => {
	try {
		const updatedUser = await UsersModel.updateOne(identity, newData)
		return updatedUser
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.findOneUserRepo = async ({ match, select }) => {
	try {
		const user = await UsersModel.findOne(match).select(select).lean()
		//console.log(user,match)
		return user
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.createUserRepo = async ({ email, username, phone, password, profile }) => {
	try {
		let singedupUser = await UsersModel.create({ email, username, phone, password })
		let updateData = {}
		if (!username) {
			username = singedupUser._id
			updateData.username = username
		}
		if (!profile) {
			profile = {}
			profile.displayName = username
			updateData.profile = profile
		}
		if (updateData) await UsersModel.updateOne({ _id: singedupUser._id }, updateData)

		singedupUser = singedupUser.toJSON()
		delete singedupUser.password
		return singedupUser
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.findOneAuthRepo = async ({ email, username, phone, options }) => {
	try {
		let filter = {}
		if (email) filter.email = email
		else if (username) filter.username = username
		else if (phone) filter.phone = phone
		if (Object.keys(filter).length === 0) return null
		const fetchedAuth = await UsersModel.findOne(filter).select(options.select).lean()
		log({ data: fetchedAuth, level: 'debug', message: 'fetchedAuth' })
		return fetchedAuth
	} catch (err) {
		errorHandler({ err })
	}
}
