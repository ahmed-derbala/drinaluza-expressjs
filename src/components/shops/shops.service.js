import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import { findMyShopsRepo, findShopsRepo, createShopRepo, findMyShopProductsRepo, findMyShopRepo, findOneShopRepo } from './shops.repository.js'
import config from '../../config/index.js'
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
export const findOneShopSrvc = async ({ match }) => {
	try {
		const shop = await findOneShopRepo({ match })
		return shop
	} catch (err) {
		return errorHandler({ err })
	}
}
export const createShopSrvc = async ({ name, address, location, owner, media, contact }) => {
	if (!media) media = config.defaults.shops.media
	log({ level: 'debug', message: 'createShopSrvc', data: { name, address, location, owner, media } })
	return createShopRepo({ name, address, location, owner, media, contact })
}

export const findMyShopSrvc = async ({ match, select }) => {
	try {
		const myShop = await findMyShopRepo({ match, select })
		return myShop
	} catch (err) {
		errorHandler({ err })
	}
}
