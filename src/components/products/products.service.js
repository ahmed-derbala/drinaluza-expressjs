const { errorHandler } = require('../../core/error')
const { log } = require('../../core/log')
const { findOneProductRepo, findManyProductsRepo, createdProductRepo } = require('./products.repository')

module.exports.findOneProductSrvc = async ({ match, select }) => {
	const fetchedProduct = await findOneProductRepo({ match, select })
	return fetchedProduct
}

module.exports.findManyProductsSrvc = async ({ match, select, page, limit }) => {
	try {
		page = parseInt(page, 10)
		limit = parseInt(limit, 10)
		const fetchedManyProduct = await findManyProductsRepo({ match, select, page, limit })
		return fetchedManyProduct
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.createProductSrvc = async ({ data }) => {
	try {
		const createdProduct = await createdProductRepo({ data })
		return createdProduct
	} catch (err) {
		throw errorHandler({ err })
	}
}
