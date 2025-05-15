const { DefaultProductModel } = require(`./default-products.schema`)
const { errorHandler } = require('../../core/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { log } = require(`../../core/log`)
const { flattenObject } = require('../../core/helpers/filters')

module.exports.findOneDefaultProductRepo = async ({ match, select }) => {
	try {
		const flattenedMatch = flattenObject({ obj: match })
		const fetchedDefaultProduct = await DefaultProductModel.findOne({ ...flattenedMatch })
			.select(select)
			.lean()
		return fetchedDefaultProduct
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.findManyDefaultProductRepo = async ({ match, select, page, limit }) => {
	try {
		const flattenedMatch = flattenObject({ obj: match })
		const fetchedManyDefaultProduct = paginateMongodb({ model: DefaultProductModel, match: { ...flattenedMatch }, select, page, limit })
		return fetchedManyDefaultProduct
	} catch (err) {
		errorHandler({ err })
	}
}
