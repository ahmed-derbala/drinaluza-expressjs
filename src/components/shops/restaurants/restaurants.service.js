import { errorHandler } from '#error'
import { log } from '#log'
import { findMyShopsRepo, findRestaurantsRepo, createShopRepo, findOneRestaurantRepo } from './restaurants.repository.js'
import config from '#config'
import { createFeedSrvc } from '#feed/feed.service.js'
import { SHOP_KINDS } from '../shops.constant.js'

export const findMyShopsSrvc = async ({ match, select, page, limit, count }) => {
	try {
		const myShops = await findMyShopsRepo({ match, select, page, limit, count })
		return myShops
	} catch (err) {
		return errorHandler({ err })
	}
}

export const findRestaurantsSrvc = async ({ match, select, page, limit, count }) => {
	return await findRestaurantsRepo({ match, select, page, limit, count })
}
export const findOneRestaurantSrvc = async ({ match, select }) => {
	return await findOneRestaurantRepo({ match, select })
}
export const createRestaurantSrvc = async ({ name, address, location, owner, media, contact, rating, kind }) => {
	if (!media) media = config.defaults.shops.media
	log({ level: 'debug', message: 'createRestaurantSrvc', data: { name, address, location, owner, media } })
	const restaurant = await createShopRepo({ name, address, location, owner, media, contact, rating, kind })
	if (restaurant) {
		createFeedSrvc({ targetData: restaurant, targetResource: SHOP_KINDS.RESTAURANT, targetId: restaurant._id, card: { kind: SHOP_KINDS.RESTAURANT } })
	}
	return restaurant
}
