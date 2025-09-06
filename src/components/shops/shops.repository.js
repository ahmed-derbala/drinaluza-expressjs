import { ShopModel } from './shops.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'
import { flattenObject } from '../../core/helpers/filters.js'

export const findMyShopsRepo = async ({ match, select, page, limit }) => {
	try {
		const flattenedMatch = flattenObject(match)
		log({ level: 'debug', message: 'findMyShopsRepo flattenedMatch', data: flattenedMatch })

		const myShops = paginateMongodb({ model: ShopModel, match: { ...flattenedMatch }, select, page, limit })
		log({ level: 'debug', message: 'findMyShopsRepo', data: myShops })
		return myShops
	} catch (err) {
		errorHandler({ err })
	}
}

export const createShopRepo = async ({ data }) => {
	try {
		const newShop = await ShopModel.create(data)
		log({ level: 'debug', message: 'createShopRepo', data: newShop })
		return newShop
	} catch (err) {
		return errorHandler({ err })
	}
}

export const findMyShopProductsRepo = async ({ match, select, page, limit }) => {
	try {
		const flattenedMatch = flattenObject(match)
		log({ level: 'debug', message: 'findMyShopProductsRepo flattenedMatch', data: flattenedMatch })

		const myShopProducts = paginateMongodb({ model: ShopModel, match: { ...flattenedMatch }, select, page, limit })
		log({ level: 'debug', message: 'findMyShopProductsRepo', data: myShopProducts })
		return myShopProducts
	} catch (err) {
		errorHandler({ err })
	}
}

export const findMyShopRepo = async ({ match, select }) => {
	try {
		const flattenedMatch = flattenObject(match)
		log({ level: 'debug', message: 'findMyShopRepo flattenedMatch', data: flattenedMatch })

		const myShop = await ShopModel.findOne({ ...flattenedMatch })
			.select(select)
			.lean()
		log({ level: 'debug', message: 'findMyShopRepo', data: myShop })
		return myShop
	} catch (err) {
		errorHandler({ err })
	}
}
