import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { createOrderSrvc, patchSaleSrvc, patchSaleStatusSrvc, findOneSaleSrvc } from './sales.service.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { createOrderVld, patchOrderStatusVld, getSalesVld } from './sales.validator.js'
import { validate } from '../../core/validation/index.js'
import { findOneProductSrvc } from '../products/products.service.js'
import { ORDER_STATUSES } from '#orders/orders.constant.js'
import { findOneBusinessSrvc } from '../businesses/businesses.service.js'
import { calculateFinalPriceSrvc } from './sales.service.js'
import { log } from '../../core/log/index.js'
import { USER_ROLES } from '#users'
import { SALES_TAB_STATUSES } from './sales.constant.js'
import { findOrdersSrvc } from '#orders'
const router = express.Router()

router.route('/').get(authenticate({ roles: [USER_ROLES.business_owner] }), validate(getSalesVld), async (req, res) => {
	try {
		const { businessSlug, productSlug, customerSlug, page = 1, limit = 10, status, tab } = req.query

		let match = { business: { owner: { _id: req.user._id } } }
		if (businessSlug) {
			match.business.slug = businessSlug
		}
		if (productSlug) {
			match.products = {}
			match.products.product = {}
			match.products.product.slug = productSlug
		}
		if (customerSlug) {
			match.customer = {}
			match.customer.slug = customerSlug
		}
		if (status) {
			match.status = {}
			match.status = status
		}
		if (tab) {
			match.status = { $in: SALES_TAB_STATUSES[tab] }
		}
		const fetchedOrders = await findOrdersSrvc({ match, page, limit })
		return resp({ status: 200, data: fetchedOrders, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router
	.route('/:orderId')
	.get(
		authenticate({ roles: [USER_ROLES.business_owner] }),
		/*validate(getSalesVld),*/ async (req, res) => {
			try {
				const match = { _id: req.params.orderId, business: { owner: { _id: req.user._id } } }
				const fetchedSale = await findOneSaleSrvc({ match })
				return resp({ status: 200, data: fetchedSale, req, res })
			} catch (err) {
				errorHandler({ err, req, res })
			}
		}
	)
	.patch(authenticate({ roles: USER_ROLES.business_owner }), validate(patchOrderStatusVld), async (req, res) => {
		try {
			const { orderId } = req.params
			const { status, products } = req.body
			const match = { _id: orderId, business: { owner: { _id: req.user._id } } }
			const sale = await findOneSaleSrvc({ match })
			if (!sale) return resp({ status: 404, message: `sale not found ${JSON.stringify(match)}`, data: null, req, res })
			/**
			 * business did not change order products
			 */
			if (!products || !Array.isArray(products) || products.length === 0) {
				const patchedSaleStatus = await patchSaleStatusSrvc({ match, sale, newStatus: status })
				if (!patchedSaleStatus.data) return resp({ status: 409, message: patchedSaleStatus.message, data: null, req, res })
				return resp({ status: 200, message: patchedSaleStatus.message, data: patchedSaleStatus.data, req, res })
			}
			/**
			 * business changed order products
			 */
			const patchedSale = await patchSaleSrvc({ match, sale, newStatus: status, newProducts: products })
			if (!patchedSale.data) return resp({ status: 409, message: patchedSale.message, data: null, req, res })
			return resp({ status: 200, message: patchedSale.message, data: patchedSale.data, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})

export default router
