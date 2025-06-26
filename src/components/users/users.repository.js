const { UserModel } = require(`./users.schema`)
const { errorHandler } = require('../../core/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { log } = require(`../../core/log`)

module.exports.updateUserRepo = async ({ identity, newData }) => {
	try {
		const updatedUser = await UserModel.updateOne(identity, newData)
		return updatedUser
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.findOneUserRepo = async ({ match, select }) => {
	try {
		const user = await UserModel.findOne(match).select(select).lean()
		//console.log(user,match)
		return user
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.createUserRepo = async ({ email, username, name, phone, password, profile, settings }) => {
	try {
		let singedupUser = await UserModel.create({ email, username, phone, password, settings })
		let updateData = {}
		if (!username) {
			username = singedupUser._id
			updateData.username = username
		}
		if (!name) {
			name = username
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
