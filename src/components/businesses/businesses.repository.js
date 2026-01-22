import { BusinessModel } from './businesses.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { flattenObject } from '../../core/helpers/filters.js'
import { log } from '../../core/log/index.js'

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

export const createBusinessRepo = async ({ owner, name }) => {
	return BusinessModel.create({ owner, name, state: { code: 'pending' } })
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
	log({ level: 'debug', data: { match, newData }, message: 'updateBusinessRepo' })
	const flattenedMatch = flattenObject(match)

	return BusinessModel.findOneAndUpdate(flattenedMatch, { $set: newData }, { new: true })
}
