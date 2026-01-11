import { errorHandler } from '../../core/error/index.js'
import { findOneProductRepo, findManyProductsRepo, createdProductRepo } from './products.repository.js'
import { log } from '../../core/log/index.js'
import config from '../../config/index.js'
import { findMyProductsRepo } from './products.repository.js'

export const findOneProductSrvc = async ({ match, select }) => {
	const fetchedProduct = await findOneProductRepo({ match, select })
	return fetchedProduct
}

export const findManyProductsSrvc = async ({ match, select, page, limit }) => {
	try {
		page = parseInt(page, 10)
		limit = parseInt(limit, 10)
		log({ level: 'debug', message: 'findManyProductsSrvc', data: { match, select, page, limit } })
		let fetchedManyProduct = await findManyProductsRepo({ match, select, page, limit })
		return fetchedManyProduct
	} catch (err) {
		errorHandler({ err })
	}
}

export const createProductSrvc = async ({ shop, name, slug, defaultProduct, price, unit, state, media }) => {
	if (!state || !state.code) {
		state = { code: 'active' }
	}
	if (!slug) {
		slug = shop.slug + '-' + defaultProduct.slug
	}
	if (!media) {
		media = defaultProduct.media
	}
	if (!name) {
		name = defaultProduct.name
	}
	return createdProductRepo({ shop, name, slug, defaultProduct, price, unit, state, media })
}

export const findMyProductsSrvc = async ({ match, select, page, limit, count }) => {
	try {
		const myProducts = await findMyProductsRepo({ match, select, page, limit, count })
		return myProducts
	} catch (err) {
		return errorHandler({ err })
	}
}
