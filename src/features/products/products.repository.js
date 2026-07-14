import { ProductModel } from './products.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'
import { flattenObject } from '../../core/helpers/filters.js'

export const updateProductRepo = async ({ match, newData }) => {
	const flattenedMatch = flattenObject(match)
	match = { ...flattenedMatch }
	//log({ level: 'debug', message: 'updateProductRepo', data: { match, newData } })
	const updatedProduct = await ProductModel.findOneAndUpdate(match, newData, { returnDocument: 'after' })
	return updatedProduct
}

export const findOneProductRepo = async ({ match, select }) => {
	const flattenedMatch = flattenObject(match)
	log({ level: 'debug', message: 'findOneProductRepo', data: { flattenedMatch, select } })
	return ProductModel.findOne({ ...flattenedMatch })
		.select(select)
		.lean()
}

export const findManyProductsRepo = async ({ match, select, page, limit }) => {
	const flattenedMatch = flattenObject(match)
	log({ level: 'debug', message: 'findManyProductsRepo', data: flattenedMatch })
	return paginateMongodb({ model: ProductModel, match: { ...flattenedMatch }, select, page, limit })
}

export const createdProductRepo = async ({ business, name, slug, defaultProduct, price, unit, state, media, searchKeywords, specs }) => {
	return ProductModel.create({ business, name, slug, defaultProduct, price, unit, state, media, searchKeywords, specs })
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
