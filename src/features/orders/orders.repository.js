import { paginateMongodb, aggregatePaginate } from '../../core/db/mongodb/pagination.js'
import { flattenObject } from '../../core/helpers/filters.js'
import { OrderModel } from '../orders/orders.schema.js'

export const findOrdersRepo = async ({ match, select, page, limit }) => {
	const flattenedMatch = flattenObject(match)
	return paginateMongodb({ model: OrderModel, match: { ...flattenedMatch }, select, page, limit })
}

export const createdOrderRepo = async ({ customer, business, products, status, price }) => {
	return OrderModel.create({ customer, business, products, status, price })
}

export const findBusinessCustomersRepo = async ({ match, select, page, limit }) => {
	const flattenedMatch = flattenObject(match)
	const pipeline = [
		// 1. Filter orders for this specific business
		{
			$match: flattenedMatch
		},

		{
			$group: {
				_id: '$customer._id',
				// This grabs the entire customer object from the first order document matched
				customer: { $first: '$customer' }
			}
		},

		// 3. Optional: Bring the customer object fields up to the root level
		// so you don't get a nested { customer: { ... } } structure.
		/* {
			 $replaceRoot: { newRoot: '$customer' }
		 },*/

		// 3. Optional: Sort the unique customers alphabetically
		{
			$sort: { 'name.en': 1 }
		}
	]

	return aggregatePaginate({ model: OrderModel, pipeline, page, limit })
}
