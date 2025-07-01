import { errorHandler } from '../../core/error/index.js'
import { findOneProductRepo, findManyProductsRepo, createdProductRepo } from './products.repository.js'
export const findOneProductSrvc = async ({ match, select }) => {
	const fetchedProduct = await findOneProductRepo({ match, select })
	return fetchedProduct
}
export const findManyProductsSrvc = async ({ match, select, page, limit }) => {
	try {
		page = parseInt(page, 10)
		limit = parseInt(limit, 10)
		const fetchedManyProduct = await findManyProductsRepo({ match, select, page, limit })
		return fetchedManyProduct
	} catch (err) {
		errorHandler({ err })
	}
}
export const createProductSrvc = async ({ data }) => {
	try {
		const createdProduct = await createdProductRepo({ data })
		return createdProduct
	} catch (err) {
		throw errorHandler({ err })
	}
}
