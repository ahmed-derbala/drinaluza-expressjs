import { findRestaurantTablesRepo, createRestaurantTableRepo } from './restaurants-tables.repository.js'

export const findRestaurantTablesSrvc = async ({ match, select, page, limit, count }) => {
	return await findRestaurantTablesRepo({ match, select, page, limit, count })
}
export const createRestaurantTableSrvc = async ({ name, capacity, restaurant, waiters }) => {
	return await createRestaurantTableRepo({ name, capacity, restaurant, waiters })
}
