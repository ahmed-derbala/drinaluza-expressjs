import { errorHandler } from '../../core/error/index.js'
import { findManyBusinessesRepo, findOneBusinessRepo, createBusinessRepo, addShopToBusinessRepo, updateBusinessRepo } from './businesses.repository.js'

export const findOneBusinessSrvc = async ({ match }) => {
	try {
		const business = await findOneBusinessRepo({ match })
		return business
	} catch (err) {
		errorHandler({ err })
	}
}

export const createBusinessSrvc = async ({ owner }) => {
	try {
		const newBusiness = await createBusinessRepo({ owner })
		return newBusiness
	} catch (err) {
		errorHandler({ err })
	}
}

export const addShopToBusinessSrvc = async ({ shop, businessId }) => {
	try {
		const updatedBusiness = await addShopToBusinessRepo({ shop, businessId })
		return updatedBusiness
	} catch (err) {
		errorHandler({ err })
	}
}

export const findManyBusinessesSrvc = async ({ match, select, page, limit }) => {
	try {
		page = parseInt(page, 10)
		limit = parseInt(limit, 10)
		const businesses = await findManyBusinessesRepo({ match, select, page, limit })
		return businesses
	} catch (err) {
		errorHandler({ err })
	}
}

export const updateBusinessSrvc = async ({ match, newData }) => {
	try {
		const business = await updateBusinessRepo({ match, newData })
		return business
	} catch (err) {
		errorHandler({ err })
	}
}
