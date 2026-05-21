import { BusinessModel } from './businesses.schema.js'
import { errorHandler } from '../../core/error/index.js'
import { paginateMongodb } from '../../core/db/mongodb/pagination.js'
import { log } from '../../core/log/index.js'
import { flattenObject } from '../../core/helpers/filters.js'

export const updateBusinessRepo = async ({ match, newData }) => {
	const flattenedMatch = flattenObject(match)
	match = { ...flattenedMatch }
	const updateFields = {}
	for (const key in newData) {
		updateFields[`${key}`] = newData[key]
	}
	log({ level: 'debug', message: 'updateBusinessRepo', data: { match, newData } })
	return BusinessModel.findOneAndUpdate(match, { $set: updateFields }, { returnDocument: 'after' })
}

export const findMyBusinessesRepo = async ({ match, select, page, limit, count }) => {
	const flattenedMatch = flattenObject(match)
	match = { ...flattenedMatch }
	if (count) {
		const businessesCount = await BusinessModel.countDocuments(match)
		return businessesCount
	}
	log({ level: 'debug', message: 'findMyBusinessesRepo flattenedMatch', data: flattenedMatch })
	const myBusinesses = await paginateMongodb({ model: BusinessModel, match, select, page, limit })
	log({ level: 'debug', message: 'findMyBusinessesRepo', data: myBusinesses })
	return myBusinesses
}

export const findBusinessesRepo = async ({ match, select, page, limit, count }) => {
	const flattenedMatch = flattenObject(match)
	match = { ...flattenedMatch }
	if (count) {
		const businessesCount = await BusinessModel.countDocuments(match)
		return businessesCount
	}
	//log({ level: 'debug', message: 'findBusinessesRepo: ', data: flattenedMatch })
	return await paginateMongodb({ model: BusinessModel, match, select, page, limit })
}

export const findOneBusinessRepo = async ({ match, select }) => {
	const flattenedMatch = flattenObject(match)
	log({ level: 'debug', message: 'findOneBusinessRepo flattenedMatch', data: flattenedMatch })
	const business = await BusinessModel.findOne({ ...flattenedMatch })
		.select(select)
		.lean()
	//log({ level: 'debug', message: 'findOneBusinessRepo', data: business })
	return business
}

export const createBusinessRepo = async ({ name, address, location, owner, media, contact, rating, kind }) => {
	const newBusiness = await BusinessModel.create({ name, address, location, owner, media, contact, rating, kind })
	//log({ level: 'debug', message: 'createBusinessRepo', data: newBusiness })
	return newBusiness
}

export const findMyBusinessProductsRepo = async ({ match, select, page, limit }) => {
	try {
		const flattenedMatch = flattenObject(match)
		log({ level: 'debug', message: 'findMyBusinessProductsRepo flattenedMatch', data: flattenedMatch })

		const myBusinessProducts = paginateMongodb({ model: BusinessModel, match: { ...flattenedMatch }, select, page, limit })
		log({ level: 'debug', message: 'findMyBusinessProductsRepo', data: myBusinessProducts })
		return myBusinessProducts
	} catch (err) {
		errorHandler({ err })
	}
}

export const findMyBusinessRepo = async ({ match, select }) => {
	try {
		const flattenedMatch = flattenObject(match)
		log({ level: 'debug', message: 'findMyBusinessRepo flattenedMatch', data: flattenedMatch })

		const myBusiness = await BusinessModel.findOne({ ...flattenedMatch })
			.select(select)
			.lean()
		log({ level: 'debug', message: 'findMyBusinessRepo', data: myBusiness })
		return myBusiness
	} catch (err) {
		errorHandler({ err })
	}
}
