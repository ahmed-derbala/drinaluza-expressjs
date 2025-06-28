const { ProductModel } = require(`./products.schema`)
const { errorHandler } = require('../../core/error')
const { paginateMongodb } = require('../../core/db/mongodb/pagination')
const { log } = require(`../../core/log`)
const { flattenObject } = require('../../core/helpers/filters')

module.exports.findOneProductRepo = async ({ match, select }) => {
	try {
		const flattenedMatch = flattenObject({ obj: match })
		console.log('....')
		console.log(flattenedMatch)
		const fetchedProduct = await ProductModel.findOne({ ...flattenedMatch })
			.select(select)
			.lean()
		return fetchedProduct
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.findManyProductsRepo = async ({ match, select, page, limit }) => {
	try {
		const flattenedMatch = flattenObject({ obj: match })
		const fetchedManyProduct = paginateMongodb({ model: ProductModel, match: { ...flattenedMatch }, select, page, limit })
		return fetchedManyProduct
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.createdProductRepo = async ({ data }) => {
	try {
		const createdProduct = await ProductModel.create({ ...data })
		console.log(createdProduct)
		return createdProduct
	} catch (err) {
		throw errorHandler({ err })
	}
}
