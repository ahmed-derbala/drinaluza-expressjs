import { ProductModel } from './products.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'
import { flattenObject } from '../../core/helpers/filters.js'

export const findOneProductRepo = async ({ match, select }) => {
	try {
		const flattenedMatch = flattenObject(match)
		log({ level: 'debug', message: 'findOneProductRepo', data: { match, select } })

		const fetchedProduct = await ProductModel.findOne({ ...flattenedMatch })
			.select(select)
			.lean()
		return fetchedProduct
	} catch (err) {
		errorHandler({ err })
	}
}

export const findManyProductsRepo = async ({ match, select, page, limit }) => {
	const flattenedMatch = flattenObject(match)
	log({ level: 'debug', message: 'findManyProductsRepo', data: flattenedMatch })
	return paginateMongodb({ model: ProductModel, match: { ...flattenedMatch }, select, page, limit })
}

export const createdProductRepo = async ({ shop, name, slug, defaultProduct, price, unit, state, media, searchKeywords }) => {
	return ProductModel.create({ shop, name, slug, defaultProduct, price, unit, state, media, searchKeywords })
}

export const findMyProductsRepo = async ({ match, select, page, limit, count }) => {
	try {
		const flattenedMatch = flattenObject(match)
		match = { ...flattenedMatch }
		if (count) {
			const productsCount = await ProductModel.countDocuments(match)
			return productsCount
		}
		const myProducts = await paginateMongodb({ model: ProductModel, match, select, page, limit })
		return myProducts
	} catch (err) {
		errorHandler({ err })
	}
}
