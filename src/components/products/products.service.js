const { errorHandler } = require('../../core/error')
const mongoose = require('mongoose')
const { log } = require('../../core/log')
const config = require(`../../config`)
const { findOneProductRepo, findManyProductRepo, createdProductRepo } = require('./products.repository')

module.exports.findOneProductSrvc = async ({ match, select }) => {
	const fetchedProduct = await findOneProductRepo({ match, select })
}

module.exports.findManyProductSrvc = async ({ match, select, page, limit }) => {
	try {
		page = parseInt(page, 10)
		limit = parseInt(limit, 10)
		const fetchedManyProduct = await findManyProductRepo({ match, select, page, limit })
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
