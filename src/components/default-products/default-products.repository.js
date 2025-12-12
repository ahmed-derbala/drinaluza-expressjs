import { DefaultProductModel } from './default-products.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'
import { flattenObject } from '../../core/helpers/filters.js'

export const findOneDefaultProductRepo = async ({ match, select }) => {
	try {
		const fetchedDefaultProduct = await DefaultProductModel.findOne(match).select(select).lean()
		log({ level: 'debug', message: 'fetchedDefaultProduct', data: JSON.stringify(fetchedDefaultProduct) })
		return fetchedDefaultProduct
	} catch (err) {
		errorHandler({ err })
	}
}
export const findManyDefaultProductsRepo = async ({ page, limit }) => {
	try {
		//const flattenedMatch = flattenObject({ obj: match })
		//const fetchedManyDefaultProducts = paginateMongodb({ model: DefaultProductModel, match: { ...flattenedMatch }, select, page, limit })
		const fetchedManyDefaultProducts = paginateMongodb({ model: DefaultProductModel, page, limit })

		return fetchedManyDefaultProducts
	} catch (err) {
		errorHandler({ err })
	}
}

export const createDefaultProductRepo = async ({ name, images, searchKeywords }) => {
	try {
		console.log(images)
		const createdDefaultProduct = DefaultProductModel.create({ name, images, searchKeywords })
		return createdDefaultProduct
	} catch (err) {
		errorHandler({ err })
	}
}
