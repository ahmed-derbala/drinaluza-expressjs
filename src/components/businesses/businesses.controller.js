import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findMyBusinessesSrvc, createBusinessSrvc, findMyBusinessSrvc, findOneBusinessSrvc, findBusinessesSrvc, updateMyBusinessSrvc } from './businesses.service.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { createProductSrvc, findManyProductsSrvc } from '../products/products.service.js'
import { createBusinessVld } from './businesses.validator.js'
import { validate } from '../../core/validation/index.js'
import { stateEnum } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { log } from '../../core/log/index.js'
const router = express.Router()

router
	.route('/')
	.post(authenticate({ role: 'business_owner' }), validate(createBusinessVld), async (req, res) => {
		try {
			const { name, address, location, kind } = req.body
			const owner = req.user

			//create new business if not exists
			let myBusiness = await findOneBusinessSrvc({ match: { owner: { _id: req.user._id } }, select: '' })
			log({ level: 'debug', data: myBusiness, message: 'myBusiness' })
			if (!myBusiness) {
				myBusiness = await createBusinessSrvc({ owner })
			}
			if (myBusiness && myBusiness.state.code != stateEnum.ACTIVE) {
				return resp({ status: 409, data: { message: `Business is ${myBusiness.state.code}` }, req, res })
			}

			owner.business = myBusiness
			const newBusiness = await createBusinessSrvc({ name, address, location, owner, kind })

			return resp({ status: newBusiness.status || 200, data: newBusiness, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.get(async (req, res) => {
		try {
			const businesses = await findBusinessesSrvc({})
			return resp({ status: 200, data: businesses, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})

router.route('/my-businesses').get(authenticate({ role: 'business_owner' }), async (req, res) => {
	try {
		let match = {}
		match.owner = { _id: req.user._id }
		const select = ''
		let { page = 1, limit = 10 } = req.query
		const myBusinesses = await findMyBusinessesSrvc({ match, select, page, limit })
		return resp({ status: 200, data: myBusinesses, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/:businessSlug/').get(async (req, res) => {
	try {
		let match = {}
		const businessSlug = req.params.businessSlug
		match.slug = businessSlug
		const business = await findOneBusinessSrvc({ match })
		return resp({ status: 200, data: business, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/my-businesses/:businessSlug/products').get(authenticate(), async (req, res) => {
	try {
		let match = {}
		//match.owner = { _id: req.user._id }
		const select = ''
		let { page = 1, limit = 10 } = req.query
		const businessSlug = req.params.businessSlug
		match.business = {}
		match.business.slug = businessSlug
		match.business.owner = { _id: req.user._id }
		const myBusinessProducts = await findManyProductsSrvc({ match, select, page, limit })
		return resp({ status: 200, data: myBusinessProducts, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/my-businesses/:businessId/products/create').post(authenticate(), async (req, res) => {
	try {
		const businessId = req.params.businessId
		const { name, price, photos, searchKeywords, availability, stock } = req.body
		const business = await findMyBusinessSrvc({ match: { _id: businessId, owner: { _id: req.user._id } }, select: '' })
		if (!business) return resp({ status: 202, message: 'business not found', data: null, req, res })

		const data = { business, owner: req.user, name, price, photos, searchKeywords, availability, stock }
		const businessProduct = await createProductSrvc({ data })
		return resp({ status: businessProduct.status || 200, data: businessProduct, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router
	.route('/my-businesses/:businessSlug/')
	.get(authenticate({ role: 'business_owner' }), async (req, res) => {
		try {
			let match = {}
			match.owner = { _id: req.user._id }
			const businessSlug = req.params.businessSlug
			//match.business = {}
			match.slug = businessSlug
			const business = await findOneBusinessSrvc({ match })
			return resp({ status: 200, data: business, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.patch(authenticate({ role: 'business_owner' }), async (req, res) => {
		try {
			let match = {}
			match.owner = { _id: req.user._id }
			const businessSlug = req.params.businessSlug
			match.slug = businessSlug
			const business = await updateMyBusinessSrvc({ match, newData: req.body })
			return resp({ status: 200, data: business, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})

router.route('/:businessSlug/products').get(async (req, res) => {
	try {
		let match = {}
		const select = ''
		let { page = 1, limit = 10 } = req.query
		const businessSlug = req.params.businessSlug
		match.business = {}
		match.business.slug = businessSlug
		const businessProducts = await findManyProductsSrvc({ match, select, page, limit })
		return resp({ status: 200, data: businessProducts, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

export default router
