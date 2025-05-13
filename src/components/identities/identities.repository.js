const { IdentitiesModel } = require(`./identities.schema`)
const { errorHandler } = require('../../core/utils/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { log } = require('../../core/log')

module.exports.getidentitiesRepo = async ({ page, limit, searchText }) => {
	try {
		let paginateMongodbOptions = { model: IdentitiesModel, page, limit }
		if (searchText) {
			paginateMongodbOptions.match = { 'facebook.id': { $regex: searchText, $options: 'i' } }
		}
		const identities = await paginateMongodb(paginateMongodbOptions)
		return identities
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.findOneIdentityRepo = async ({ match, select }) => {
	try {
		const identity = await IdentitiesModel.findOne(match).select(select).lean()
		return identity
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.createIdentityRepo = async ({ name, facebook, rating, createdBy }) => {
	try {
		const identity = await IdentitiesModel.create({ name, facebook, rating, createdBy })
		return identity
	} catch (err) {
		return errorHandler({ err })
	}
}
