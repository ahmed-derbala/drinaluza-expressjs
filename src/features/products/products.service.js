import { errorHandler } from '../../core/error/index.js'
import { findOneProductRepo, findProductsRepo, createdProductRepo, updateProductRepo } from './products.repository.js'
import { log } from '../../core/log/index.js'
import { findMyProductsRepo } from './products.repository.js'
import { productsCollection } from './products.constant.js'

export const findOneProductSrvc = async ({ match, select }) => {
	return findOneProductRepo({ match, select })
}

export const findProductsSrvc = async ({ match, select, page, limit }) => {
	page = parseInt(page, 10)
	limit = parseInt(limit, 10)
	log({ level: 'debug', message: 'findProductsSrvc', data: { match, select, page, limit } })
	let fetchedProduct = await findProductsRepo({ match, select, page, limit })
	return fetchedProduct
}

export const createProductSrvc = async ({ business, name, slug, defaultProduct, price, unit, state, media, searchKeywords, specs }) => {
	if (!state || !state.code) {
		state = { code: 'active' }
	}
	if (!slug) {
		slug = business.slug + '-' + defaultProduct.slug
	}
	if (!media) {
		media = defaultProduct.media
	}
	if (!name) {
		name = defaultProduct.name
	}
	const product = await createdProductRepo({ business, name, slug, defaultProduct, price, unit, state, media, searchKeywords, specs })
	/*if (product) {
		await createFeedSrvc({ targetData: product, targetResource: productsCollection, targetId: product._id, card: { kind: 'product' } })
	}*/
	return product
}

export const updateProductSrvc = async ({ match, newData }) => {
	return updateProductRepo({ match, newData })
}

export const findMyProductsSrvc = async ({ match, select, page, limit, count }) => {
	try {
		const myProducts = await findMyProductsRepo({ match, select, page, limit, count })
		return myProducts
	} catch (err) {
		return errorHandler({ err })
	}
}

export const patchRatingProductSrvc = async ({ productId, stars, rating }) => {
	let count = rating.count + 1
	let total = rating.total + stars
	let average = total / count
	let breakdown = rating.breakdown
	breakdown[stars] = breakdown[stars] + 1
	const newRating = { count, total, average, breakdown }
	return updateProductRepo({ match: { _id: productId }, newData: { rating: newRating } })
}
