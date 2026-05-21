import { errorHandler } from '#error'
import { log } from '#log'
import { findMyBusinessesRepo, findRestaurantsRepo, createBusinessRepo, findOneRestaurantRepo } from './restaurants.repository.js'
import config from '#config'
import { createFeedSrvc } from '#feed/feed.service.js'
import { BUSINESS_KINDS } from '../businesses.constant.js'

export const findMyBusinessesSrvc = async ({ match, select, page, limit, count }) => {
	try {
		const myBusinesses = await findMyBusinessesRepo({ match, select, page, limit, count })
		return myBusinesses
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
	if (!media) media = config.defaults.businesses.media
	log({ level: 'debug', message: 'createRestaurantSrvc', data: { name, address, location, owner, media } })
	const restaurant = await createBusinessRepo({ name, address, location, owner, media, contact, rating, kind })
	if (restaurant) {
		createFeedSrvc({ targetData: restaurant, targetResource: BUSINESS_KINDS.RESTAURANT, targetId: restaurant._id, card: { kind: BUSINESS_KINDS.RESTAURANT } })
	}
	return restaurant
}
