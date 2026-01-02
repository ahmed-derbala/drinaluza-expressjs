import { BusinessModel } from './businesses.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { flattenObject } from '../../core/helpers/filters.js'

export const findOneBusinessRepo = async ({ match, select }) => {
	try {
		const flattenedMatch = flattenObject(match)
		const fetchedBusiness = await BusinessModel.findOne({ ...flattenedMatch })
			.select(select)
			.lean()
		return fetchedBusiness
	} catch (err) {
		errorHandler({ err })
	}
}

export const findManyBusinessesRepo = async ({ match, select, page, limit, count }) => {
	try {
		const flattenedMatch = flattenObject(match)
		match = { ...flattenedMatch }
		if (count) {
			const businessesCount = await BusinessModel.countDocuments(match)
			return businessesCount
		}
		const businesses = await paginateMongodb({ model: BusinessModel, match, select, page, limit })
		return businesses
	} catch (err) {
		errorHandler({ err })
	}
}

export const createBusinessRepo = async ({ owner }) => {
	try {
		const name = owner.name + ' New Business'
		const newBusiness = await BusinessModel.create({ owner, name, state: { code: 'pending' } })
		return newBusiness
	} catch (err) {
		throw errorHandler({ err })
	}
}

export const addShopToBusinessRepo = async ({ match, select, page, limit, count }) => {
	try {
		const flattenedMatch = flattenObject(match)
		match = { ...flattenedMatch }
		if (count) {
			const businessesCount = await BusinessModel.countDocuments(match)
			return businessesCount
		}
		const businesses = await paginateMongodb({ model: BusinessModel, match, select, page, limit })
		return businesses
	} catch (err) {
		errorHandler({ err })
	}
}

export const updateBusinessRepo = async ({ match, newData }) => {
	try {
		const updatedBusiness = await BusinessModel.findByIdAndUpdate(match._id, { $set: newData }, { new: true })
		return updatedBusiness
	} catch (err) {
		errorHandler({ err })
	}
}
