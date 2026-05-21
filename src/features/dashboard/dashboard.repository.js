import { DashboardModel } from './dashboard.schema.js'
import { flattenObject } from '#core'

export const createDashboardRepo = async ({ user, business, kind, purchases, sales, customers, products, revenues, expenses }) => {
	return await DashboardModel.create({ user, business, kind, purchases, sales, customers, products, revenues, expenses })
}

export const findOneDashboardRepo = async ({ match, select }) => {
	const flattenedMatch = flattenObject(match)
	return await DashboardModel.findOne({ ...flattenedMatch })
		.select(select)
		.lean()
}
