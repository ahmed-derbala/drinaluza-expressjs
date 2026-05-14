import { ShopModel } from '#shops/shops.schema.js'
import { errorHandler } from '#core/error/index.js'
import { paginateMongodb } from '#core/db/mongodb/pagination.js'
import { log } from '#core/log/index.js'
import { flattenObject } from '#core/helpers/filters.js'
import { SHOP_KINDS } from '#shops/shops.constant.js'

export const updateShopRepo = async ({ match, newData }) => {
	return ShopModel.findOneAndUpdate(match, newData, { returnDocument: 'after' })
}

export const findMyShopsRepo = async ({ match, select, page, limit, count }) => {
	try {
		const flattenedMatch = flattenObject(match)
		match = { ...flattenedMatch }
		if (count) {
			const shopsCount = await ShopModel.countDocuments(match)
			return shopsCount
		}
		//log({ level: 'debug', message: 'findMyShopsRepo flattenedMatch', data: flattenedMatch })
		const myShops = await paginateMongodb({ model: ShopModel, match, select, page, limit })
		//log({ level: 'debug', message: 'findMyShopsRepo', data: myShops })
		return myShops
	} catch (err) {
		errorHandler({ err })
	}
}

export const findRestaurantsRepo = async ({ match, select, page, limit, count }) => {
	if (!match) match = {}
	match.kind = SHOP_KINDS.RESTAURANT
	const flattenedMatch = flattenObject(match)
	match = { ...flattenedMatch }
	if (count) {
		const shopsCount = await ShopModel.countDocuments(match)
		return shopsCount
	}
	//log({ level: 'debug', message: 'findShopsRepo: ', data: flattenedMatch })
	return await paginateMongodb({ model: ShopModel, match, select, page, limit })
}

export const findOneRestaurantRepo = async ({ match, select }) => {
	const flattenedMatch = flattenObject(match)
	log({ level: 'debug', message: 'findOneRestaurantRepo flattenedMatch', data: flattenedMatch })
	const restaurant = await ShopModel.findOne({ ...flattenedMatch })
		.select(select)
		.lean()
	//log({ level: 'debug', message: 'findOneShopRepo', data: restaurant })
	return restaurant
}

export const createShopRepo = async ({ name, address, location, owner, media, contact, rating, kind }) => {
	const newShop = await ShopModel.create({ name, address, location, owner, media, contact, rating, kind })
	//log({ level: 'debug', message: 'createShopRepo', data: newShop })
	return newShop
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
