import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import { findMyBusinessesRepo, findBusinessesRepo, createBusinessRepo, findMyBusinessProductsRepo, findMyBusinessRepo, findOneBusinessRepo, updateBusinessRepo } from './businesses.repository.js'
import config from '../../config/index.js'
import { createFeedSrvc } from '../feed/feed.service.js'
import { businessesCollection } from './businesses.constant.js'
import { updateOneCardFeedRepo } from '../feed/feed.repository.js'

export const findMyBusinessesSrvc = async ({ match, owner, select, page, limit, count }) => {
	const myBusinesses = await findMyBusinessesRepo({ match, select, page, limit, count })
	//owner double check
	//if(owner._id !=)
	return myBusinesses
}

export const findBusinessesSrvc = async ({ match, select, page, limit, count }) => {
	return await findBusinessesRepo({ match, select, page, limit, count })
}
export const findOneBusinessSrvc = async ({ match, select }) => {
	return await findOneBusinessRepo({ match, select })
}
export const updateMyBusinessSrvc = async ({ match, newData }) => {
	const updatedFeedCard = await updateOneCardFeedRepo({ match: { 'targetData.slug': match.slug }, newData })
	return await updateBusinessRepo({ match, newData })
}
export const createBusinessSrvc = async ({ name, address, location, owner, media, contact, rating, kind }) => {
	if (!media) media = config.defaults.businesses.media
	if (!name) {
		name = { en: `${owner.name.en} business` }
	}
	log({ level: 'debug', message: 'createBusinessSrvc', data: { name, address, location, owner, media } })
	const business = await createBusinessRepo({ name, address, location, owner, media, contact, rating, kind })
	if (business) {
		createFeedSrvc({ targetData: business, targetResource: businessesCollection, targetId: business._id, card: { kind: 'business' } })
	}
	return business
}

export const findMyBusinessSrvc = async ({ match, select }) => {
	try {
		const myBusiness = await findMyBusinessRepo({ match, select })
		return myBusiness
	} catch (err) {
		errorHandler({ err })
	}
}

export const patchRatingBusinessSrvc = async ({ businessId, stars, rating }) => {
	let count = rating.count + 1
	let total = rating.total + stars
	let average = total / count
	let breakdown = rating.breakdown
	breakdown[stars] = breakdown[stars] + 1
	const newRating = { count, total, average, breakdown }
	return updateBusinessRepo({ match: { _id: businessId }, newData: { rating: newRating } })
}
