import { errorHandler } from '../../core/error/index.js'
import { findOneDefaultProductRepo, findManyDefaultProductsRepo, createDefaultProductRepo } from './default-products.repository.js'

export const findOneDefaultProductSrvc = async ({ slug }) => {
	const fetchedDefaultProduct = await findOneDefaultProductRepo({ match: { slug }, select: '' })
	return fetchedDefaultProduct
}

export const findManyDefaultProductsSrvc = async ({ page, limit }) => {
	try {
		page = parseInt(page, 10)
		limit = parseInt(limit, 10)
		const fetchedManyDefaultProducts = await findManyDefaultProductsRepo({ page, limit })
		return fetchedManyDefaultProducts
	} catch (err) {
		errorHandler({ err })
	}
}

export const createDefaultProductSrvc = async ({ name, images, searchKeywords }) => {
	try {
		const createdDefaultProduct = await createDefaultProductRepo({ name, images, searchKeywords })
		return createdDefaultProduct
	} catch (err) {
		errorHandler({ err })
	}
}
