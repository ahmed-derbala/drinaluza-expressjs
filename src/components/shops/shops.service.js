import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import { findMyShopsRepo, findShopsRepo, createShopRepo, findMyShopProductsRepo, findMyShopRepo, findOneShopRepo, updateShopRepo } from './shops.repository.js'
import config from '../../config/index.js'
import { createFeedSrvc } from '../feed/feed.service.js'
import { shopsCollection } from './shops.constants.js'

export const findMyShopsSrvc = async ({ match, select, page, limit, count }) => {
	try {
		const myShops = await findMyShopsRepo({ match, select, page, limit, count })
		return myShops
	} catch (err) {
		return errorHandler({ err })
	}
}

export const findShopsSrvc = async ({ match, select, page, limit, count }) => {
	return await findShopsRepo({ match, select, page, limit, count })
}
export const findOneShopSrvc = async ({ match, select }) => {
	return await findOneShopRepo({ match, select })
}
export const createShopSrvc = async ({ name, address, location, owner, media, contact, rating }) => {
	if (!media) media = config.defaults.shops.media
	log({ level: 'debug', message: 'createShopSrvc', data: { name, address, location, owner, media } })
	const shop = await createShopRepo({ name, address, location, owner, media, contact, rating })
	if (shop) {
		createFeedSrvc({ targetData: shop, targetResource: shopsCollection, targetId: shop._id, card: { kind: 'shop' } })
	}
	return shop
}

export const findMyShopSrvc = async ({ match, select }) => {
	try {
		const myShop = await findMyShopRepo({ match, select })
		return myShop
	} catch (err) {
		errorHandler({ err })
	}
}

export const patchRatingShopSrvc = async ({ shopId, stars, rating }) => {
	let count = rating.count + 1
	let total = rating.total + stars
	let average = total / count
	let breakdown = rating.breakdown
	breakdown[stars] = breakdown[stars] + 1
	const newRating = { count, total, average, breakdown }
	return updateShopRepo({ match: { _id: shopId }, newData: { rating: newRating } })
}
