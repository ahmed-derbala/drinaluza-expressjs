import { DefaultProductModel } from './default-products.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'
import { flattenObject } from '../../core/helpers/filters.js'
export const findOneDefaultProductRepo = async ({ match, select }) => {
	try {
		const flattenedMatch = flattenObject({ obj: match })
		const fetchedDefaultProduct = await DefaultProductModel.findOne({ ...flattenedMatch })
			.select(select)
			.lean()
		return fetchedDefaultProduct
	} catch (err) {
		errorHandler({ err })
	}
}
export const findManyDefaultProductRepo = async ({ match, select, page, limit }) => {
	try {
		const flattenedMatch = flattenObject({ obj: match })
		const fetchedManyDefaultProduct = paginateMongodb({ model: DefaultProductModel, match: { ...flattenedMatch }, select, page, limit })
		return fetchedManyDefaultProduct
	} catch (err) {
		errorHandler({ err })
	}
}
