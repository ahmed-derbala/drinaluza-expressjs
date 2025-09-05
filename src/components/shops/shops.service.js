import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import { findMyShopsRepo, createShopRepo } from './shops.repository.js'
import config from '../../config/index.js'

export const findMyShopsSrvc = async ({ match, select, page, limit }) => {
	try {
		const myShops = await findMyShopsRepo({ match, select, page, limit })
		return myShops
	} catch (err) {
		errorHandler({ err })
	}
}

export const createShopSrvc = async ({ data }) => {
	try {
		const newShop = await createShopRepo({ data })
		return newShop
	} catch (err) {
		return errorHandler({ err })
	}
}
