import express from 'express'
import { resp } from '../../../core/helpers/resp.js'
import { createRestaurantSrvc, findRestaurantsSrvc } from './restaurants.service.js'
import { errorHandler } from '../../../core/error/index.js'
import { authenticate } from '../../../core/auth/index.js'
import { createRestaurantVld } from './restaurants.validator.js'
import { validate } from '../../../core/validation/index.js'
import { BUSINESS_KINDS } from '../businesses.constant.js'
import { findOneBusinessSrvc } from '#businesses/businesses.service.js'
import { findOneRestaurantSrvc } from './restaurants.service.js'
import { findRestaurantTablesSrvc, createRestaurantTableSrvc } from './restaurants-tables.service.js'
import { STATES } from '../../../core/db/mongodb/shared-schemas/state.schema.js'
const router = express.Router()

router
	.route('/')
	.get(async (req, res) => {
		try {
			const { page, limit } = req.query
			const match = { kind: BUSINESS_KINDS.RESTAURANT }
			const restaurants = await findRestaurantsSrvc({ match, page, limit })
			return resp({ status: 200, data: restaurants, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(validate(createRestaurantVld), authenticate({ role: 'business_owner' }), async (req, res) => {
		try {
			const business = await findOneBusinessSrvc({ match: { owner: { _id: req.user._id } } })
			if (!business) return resp({ status: 202, message: 'Business not found', data: null, req, res })
			if (business.state.code != STATES.ACTIVE) return resp({ status: 409, message: `Business is ${business.state.code}`, data: null, req, res })
			let owner = req.user
			owner.business = business
			const restaurant = await createRestaurantSrvc({ ...req.body, kind: BUSINESS_KINDS.RESTAURANT, owner })
			return resp({ status: 200, data: restaurant, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})

router
	.route('/:restaurantSlug/tables')
	.get(async (req, res) => {
		try {
			const { page, limit } = req.query
			const match = { 'restaurant.slug': req.params.restaurantSlug }
			const tables = await findRestaurantTablesSrvc({ match, page, limit })
			return resp({ status: 200, data: tables, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(
		//validate(createRestaurantVld),
		authenticate({ role: 'business_owner' }),
		async (req, res) => {
			try {
				const business = await findOneBusinessSrvc({ match: { owner: { _id: req.user._id } } })
				if (!business) return resp({ status: 202, message: 'Business not found', data: null, req, res })
				if (business.state.code != BUSINESS_STATES.ACTIVE) return resp({ status: 409, message: `Business is ${business.state.code}`, data: null, req, res })
				let owner = req.user
				owner.business = business
				const restaurant = await findOneRestaurantSrvc({ match: { owner: { _id: req.user._id } } })
				if (!restaurant) return resp({ status: 202, message: 'Restaurant not found', data: null, req, res })
				const table = await createRestaurantTableSrvc({ ...req.body, restaurant })
				return resp({ status: 200, data: table, req, res })
			} catch (err) {
				errorHandler({ err, req, res })
			}
		}
	)

export default router
