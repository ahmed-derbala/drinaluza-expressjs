import { DefaultProductModel } from './default-products.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb, formatMongoQuery } from '#mongodb'
import { log } from '../../core/log/index.js'

export const findOneDefaultProductRepo = async ({ match, select }) => {
	//log({ level: 'debug', message: 'fetchedDefaultProduct', data: JSON.stringify(fetchedDefaultProduct) })
	return DefaultProductModel.findOne(match).select(select).lean()
}
export const findDefaultProductsRepo = async ({ page, limit }) => {
	//const flattenedMatch = formatMongoQuery({ obj: match })
	//const fetchedManyDefaultProducts = paginateMongodb({ model: DefaultProductModel, match: { ...flattenedMatch }, select, page, limit })
	return paginateMongodb({ model: DefaultProductModel, page, limit })
}

export const createDefaultProductRepo = async ({ name, slug, media, searchKeywords, price, unit, specs }) => {
	return DefaultProductModel.create({ name, slug, media, searchKeywords, price, unit, specs })
}
