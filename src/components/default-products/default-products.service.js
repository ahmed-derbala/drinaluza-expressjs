import { errorHandler } from '../../core/error/index.js'
import { findOneDefaultProductRepo, findManyDefaultProductRepo } from './default-products.repository.js'
export const findOneDefaultProductSrvc = async ({ match, select }) => {
	const fetchedDefaultProduct = await findOneDefaultProductRepo({ match, select })
}
export const findManyDefaultProductSrvc = async ({ match, select, page, limit }) => {
	try {
		page = parseInt(page, 10)
		limit = parseInt(limit, 10)
		const fetchedManyDefaultProduct = await findManyDefaultProductRepo({ match, select, page, limit })
		return fetchedManyDefaultProduct
	} catch (err) {
		errorHandler({ err })
	}
}
