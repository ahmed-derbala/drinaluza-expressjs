const { ProductModel } = require(`./products.schema`)
const { errorHandler } = require('../../core/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { log } = require(`../../core/log`)
const { flattenObject } = require('../../core/helpers/filters')

module.exports.findOneProductRepo = async ({ match, select }) => {
	try {
		const flattenedMatch = flattenObject({ obj: match })
		const fetchedProduct = await ProductModel.findOne({ ...flattenedMatch })
			.select(select)
			.lean()
		return fetchedProduct
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.findManyProductRepo = async ({ match, select, page, limit }) => {
	try {
		const flattenedMatch = flattenObject({ obj: match })
		const fetchedManyProduct = paginateMongodb({ model: ProductModel, match: { ...flattenedMatch }, select, page, limit })
		return fetchedManyProduct
	} catch (err) {
		errorHandler({ err })
	}
}
