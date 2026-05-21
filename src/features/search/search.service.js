import { errorHandler } from '../../core/error/index.js'
import { searchProductsRepo } from './search.repository.js'
import { log } from '../../core/log/index.js'

export const searchProductsSrvc = async ({ text, select, page, limit }) => {
	try {
		page = parseInt(page, 10)
		limit = parseInt(limit, 10)
		log({ level: 'debug', message: 'searchProductsSrvc', data: { text, select, page, limit } })

		const fetchedProducts = await searchProductsRepo({ text, select, page, limit })
		return fetchedProducts
	} catch (err) {
		errorHandler({ err })
	}
}
