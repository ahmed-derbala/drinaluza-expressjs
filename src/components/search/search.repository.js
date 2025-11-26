import { ProductModel } from '../products/products.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'
import { flattenObject } from '../../core/helpers/filters.js'

export const searchProductsRepo = async ({ text, select, page, limit }) => {
	try {
		log({ level: 'debug', message: 'searchProductsRepo', data: { text } })

		const match = { searchTerms: { $regex: text, $options: 'i' } }
		const fetchedProducts = paginateMongodb({ model: ProductModel, match, select, page, limit })

		return fetchedProducts
	} catch (err) {
		errorHandler({ err })
	}
}
