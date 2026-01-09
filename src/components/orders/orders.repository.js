import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { flattenObject } from '../../core/helpers/filters.js'
import { OrderModel } from '../orders/orders.schema.js'

export const findOrdersRepo = async ({ match, page, limit }) => {
	const flattenedMatch = flattenObject(match)
	return paginateMongodb({ model: OrderModel, match: { ...flattenedMatch }, select: '', page, limit })
}
