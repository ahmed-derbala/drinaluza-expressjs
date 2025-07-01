import { ProductModel } from './products.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'
import { flattenObject } from '../../core/helpers/filters.js'

export const findOneProductRepo = async ({ match, select }) => {
	try {
		const flattenedMatch = flattenObject({ obj: match })
		console.log('....')
		console.log(flattenedMatch)
		const fetchedProduct = await ProductModel.findOne({ ...flattenedMatch })
			.select(select)
			.lean()
		return fetchedProduct
	} catch (err) {
		errorHandler({ err })
	}
}
export const findManyProductsRepo = async ({ match, select, page, limit }) => {
	try {
		const flattenedMatch = flattenObject({ obj: match })
		const fetchedManyProduct = paginateMongodb({ model: ProductModel, match: { ...flattenedMatch }, select, page, limit })
		return fetchedManyProduct
	} catch (err) {
		errorHandler({ err })
	}
}
export const createdProductRepo = async ({ data }) => {
	try {
		const createdProduct = await ProductModel.create({ ...data })
		console.log(createdProduct)
		return createdProduct
	} catch (err) {
		throw errorHandler({ err })
	}
}
