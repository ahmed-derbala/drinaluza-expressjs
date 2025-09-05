import { ShopModel } from './shops.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'

export const findMyShopsRepo = async ({ match, select, page, limit }) => {
	try {
		const myShops = paginateMongodb({ model: ShopModel, match, select, page, limit })
		log({ level: 'debug', message: 'findMyShopsRepo', data: myShops })
		return myShops
	} catch (err) {
		errorHandler({ err })
	}
}
