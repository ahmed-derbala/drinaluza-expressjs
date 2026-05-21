import { createDashboardRepo, findOneDashboardRepo } from './dashboard.repository.js'

export const createPersonalDashboardSrvc = async ({ user, expenses, purchases }) => {
	try {
		const kind = 'personal'
		return await createDashboardRepo({ user, kind, expenses, purchases })
	} catch (error) {
		console.error(error)
		return null
	}
}

export const createBusinessDashboardSrvc = async ({ user, business, sales, customers, products, revenues, expenses }) => {
	try {
		const kind = 'business'
		return await createDashboardRepo({ user, business, kind, sales, customers, products, revenues, expenses })
	} catch (error) {
		console.error(error)
		return null
	}
}

export const findOneDashboard = async ({ match = { user, kind } }) => {
	return await findOneDashboardRepo({ match })
}
