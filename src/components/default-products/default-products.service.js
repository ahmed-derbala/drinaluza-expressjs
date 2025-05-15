const { errorHandler } = require('../../core/error')
const mongoose = require('mongoose')
const { log } = require('../../core/log')
const config = require(`../../config`)
const { findOneDefaultProductRepo, findManyDefaultProductRepo } = require('./default-products.repository')

module.exports.findOneDefaultProductSrvc = async ({ match, select }) => {
	const fetchedDefaultProduct = await findOneDefaultProductRepo({ match, select })
}

module.exports.findManyDefaultProductSrvc = async ({ match, select, page, limit }) => {
	try {
		page = parseInt(page, 10)
		limit = parseInt(limit, 10)
		const fetchedManyDefaultProduct = await findManyDefaultProductRepo({ match, select, page, limit })
		return fetchedManyDefaultProduct
	} catch (err) {
		errorHandler({ err })
	}
}
