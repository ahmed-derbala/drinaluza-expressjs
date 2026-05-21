import { TableModel } from './schemas/tables.schema.js'
import { paginateMongodb } from '#core/db/mongodb/pagination.js'
import { flattenObject } from '#core/helpers/filters.js'
import { errorHandler } from '#core/error/index.js'
import { log } from '#core/log/index.js'
import { BUSINESS_KINDS } from '#businesses/businesses.constant.js'

export const findRestaurantTablesRepo = async ({ match, select, page, limit, count }) => {
	const flattenedMatch = flattenObject(match)
	match = { ...flattenedMatch }
	if (count) {
		const tablesCount = await TableModel.countDocuments(match)
		return tablesCount
	}
	//log({ level: 'debug', message: 'findMyBusinessesRepo flattenedMatch', data: flattenedMatch })
	const tables = await paginateMongodb({ model: TableModel, match, select, page, limit })
	log({ level: 'debug', message: 'findRestaurantTablesRepo', data: { match, select, page, limit, count } })
	return tables
}

export const createRestaurantTableRepo = async ({ name, capacity, restaurant, waiters }) => {
	log({ level: 'debug', message: 'createRestaurantTableRepo', data: { name, capacity, restaurant, waiters } })
	return TableModel.create({ name, capacity, restaurant, waiters })
}
