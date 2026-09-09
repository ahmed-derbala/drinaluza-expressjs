import { DashboardModel } from './dashboard.schema.js'
import { formatMongoQuery } from '#mongodb'

export const createDashboardRepo = async ({ user, business, kind, purchases, sales, customers, products, revenues, expenses }) => {
	return await DashboardModel.create({ user, business, kind, purchases, sales, customers, products, revenues, expenses })
}

export const findOneDashboardRepo = async ({ match, select }) => {
	const flattenedMatch = formatMongoQuery(match)
	return await DashboardModel.findOne({ ...flattenedMatch })
		.select(select)
		.lean()
}

export const findDashboardProfilesByUserRepo = async ({ match, select }) => {
	return DashboardModel.find({ 'user._id': match.user._id }).lean()
}
