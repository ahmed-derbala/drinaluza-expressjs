const { AuthModel } = require(`./auth.schema`)
const { errorHandler } = require('../../core/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { log } = require(`../../core/log`)

module.exports.createAuthRepo = async ({ user, password }) => {
	try {
		const createdAuth = await AuthModel.create({ user, password })
		return createdAuth
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.findOneAuthRepo = async ({ match, select }) => {
	try {
		/*let match = {}
		if (email) match.email = email
		else if (username) match.username = username
		else if (phone) match.phone = phone
		if (Object.keys(match).length === 0) return null*/
		const fetchedAuth = await AuthModel.findOne({ 'user.username': match.user.username }).select(select).lean()
		return fetchedAuth
	} catch (err) {
		errorHandler({ err })
	}
}
