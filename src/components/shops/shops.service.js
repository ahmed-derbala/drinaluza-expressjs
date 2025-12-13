import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import { findMyShopsRepo, createShopRepo, findMyShopProductsRepo, findMyShopRepo, findOneShopRepo } from './shops.repository.js'
import config from '../../config/index.js'

export const findMyShopsSrvc = async ({ match, select, page, limit, count }) => {
	try {
		const myShops = await findMyShopsRepo({ match, select, page, limit, count })
		return myShops
	} catch (err) {
		return errorHandler({ err })
	}
}

export const findOneShopSrvc = async ({ match }) => {
	try {
		const shop = await findOneShopRepo({ match })
		return shop
	} catch (err) {
		return errorHandler({ err })
	}
}
export const createShopSrvc = async ({ name, address, location, owner, business }) => {
	try {
		const newShop = await createShopRepo({ name, address, location, owner, business })
		//log({ level: 'debug', message: 'createShopSrvc', data: newShop })
		return newShop
	} catch (err) {
		return errorHandler({ err })
	}
}

export const findMyShopSrvc = async ({ match, select }) => {
	try {
		const myShop = await findMyShopRepo({ match, select })
		return myShop
	} catch (err) {
		errorHandler({ err })
	}
}
