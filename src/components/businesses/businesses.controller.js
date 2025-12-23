import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { findMyShopsSrvc } from '../shops/shops.service.js'
import { findMyProductsSrvc } from '../products/products.service.js'
import { findMySalesSrvc } from '../sales/sales.service.js'
import { userRolesEnum } from '../users/users.enum.js'
import { findManyBusinessesSrvc, findOneBusinessSrvc, createBusinessSrvc, updateBusinessSrvc } from './businesses.service.js'
import { updateUserSrvc } from '../users/users.service.js'
import { destroyUserSessionsSrvc } from '../../core/auth/auth.service.js'
const router = express.Router()

router.route('/my-business').get(authenticate({ role: 'shop_owner' }), async (req, res) => {
	try {
		let results = {}
		const shopsCount = await findMyShopsSrvc({ match: { owner: { _id: req.user._id } }, count: true })
		results.shopsCount = shopsCount

		const productsCount = await findMyProductsSrvc({ match: { shop: { owner: { _id: req.user._id } } }, count: true })
		results.productsCount = productsCount

		const salessCount = await findMySalesSrvc({ match: { shop: { owner: { _id: req.user._id } } }, count: true })
		results.salessCount = salessCount
		return resp({ status: 200, data: results, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router
	.route('/requests')
	.get(authenticate({ role: userRolesEnum.SUPER }), async (req, res) => {
		try {
			const requests = await findManyBusinessesSrvc({ match: { state: { code: 'pending' } }, select: '' })
			return resp({ status: 200, data: requests, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(authenticate({ role: userRolesEnum.CUSTOMER }), async (req, res) => {
		try {
			const owner = req.user
			const fetchedBusiness = await findOneBusinessSrvc({ match: { owner: { _id: owner._id } }, select: '' })
			if (fetchedBusiness) return resp({ status: 409, message: 'Business already exists for this owner', req, res })
			const request = await createBusinessSrvc({ owner })
			return resp({ status: 200, data: request, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})

router.route('/:businessId').patch(authenticate({ role: userRolesEnum.SUPER }), async (req, res) => {
	try {
		const { state } = req.body
		const business = await findOneBusinessSrvc({ match: { _id: req.params.businessId }, select: '' })
		if (!business) return resp({ status: 404, message: 'Business not found', req, res })
		if (state && state.code === 'active') {
			updateUserSrvc({ match: { _id: business.owner._id }, newData: { role: userRolesEnum.SHOP_OWNER } })
			destroyUserSessionsSrvc({ userId: business.owner._id })
		}
		const patchedBusiness = await updateBusinessSrvc({ match: { _id: req.params.businessId }, newData: req.body })
		return resp({ status: 200, data: patchedBusiness, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/:businessId/customers').get(authenticate(), async (req, res) => {
	try {
		const customers = await findMySalesSrvc({ /*match: { shop: { owner: { business: { _id: req.params.businessId } } } },*/ select: 'customer' })
		return resp({ status: 200, data: customers, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

export default router
