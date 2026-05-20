import { createDashboardRepo, findOneDashboardRepo } from './dashboard.repository.js'

export const createPersonalDashboardSrvc = async ({ user, expenses, purchases }) => {
	const kind = 'personal'
	return await createDashboardRepo({ user, kind, expenses, purchases })
}

export const createBusinessDashboardSrvc = async ({ user, business, sales, customers, products, revenues, expenses }) => {
	const kind = 'business'
	return await createDashboardRepo({ user, business, kind, sales, customers, products, revenues, expenses })
}

export const findOneDashboard = async ({ match = { user, kind } }) => {
	return await findOneDashboardRepo({ match })
}
