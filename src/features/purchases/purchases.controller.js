import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findOneOrderSrvc, patchOrderStatusSrvc } from './purchases.service.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { createPurchaseVld, patchOrderStatusVld } from './purchases.validator.js'
import { validate } from '../../core/validation/index.js'
import { findOneProductSrvc } from '../products/products.service.js'
import { ORDER_STATUSES } from '#orders/orders.constant.js'
import { findOneBusinessSrvc } from '../businesses/businesses.service.js'
import { processLineTotalSrvc, createPurchaseSrvc } from './purchases.service.js'
import { log } from '../../core/log/index.js'
import { USER_ROLES } from '../users/users.enum.js'
import { findOrdersSrvc } from '../orders/orders.service.js'
import { findOneCustomerSrvc } from '../users/users.service.js'

const router = express.Router()
router
	.route('/')
	.get(authenticate(), async (req, res) => {
		try {
			let match = { customer: { _id: req.user._id } }
			let { page = 1, limit = 10, status } = req.query
			if (status) {
				match.status = status
			}
			const fetchedOrders = await findOrdersSrvc({ match, page, limit })
			return resp({ status: 200, data: fetchedOrders, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(authenticate(), validate(createPurchaseVld), async (req, res) => {
		try {
			let { products, business } = req.body
			//check business
			business = await findOneBusinessSrvc({ match: { slug: business.slug } })
			if (!business) return resp({ status: 404, message: 'business not found', data: null, req, res })
			const customer = await findOneCustomerSrvc({ match: { slug: req.user.slug } })
			log({ level: 'debug', message: 'create purchase', data: { customer, business } })
			//business_owner cannot purchase from his businesses
			if (customer.role === USER_ROLES.BUSINESS_OWNER) {
				const ownedBusiness = await findOneBusinessSrvc({ match: { owner: { _id: customer._id }, slug: business.slug }, select: '_id' })
				if (ownedBusiness) return resp({ status: 409, message: 'business owners cannot purchase from their own businesses', data: null, req, res })
			}
			let match = {},
				price = { total: { tnd: 0, eur: null, usd: null } }
			//process products
			for (let p of products) {
				if (p.product._id) {
					match._id = p.product._id
				} else {
					match.slug = p.product.slug
				}
				p.product = await findOneProductSrvc({ match, select: '+media +defaultProduct' })
				if (!p.product) return resp({ status: 404, data: null, message: `product ${JSON.stringify(match)} not found`, req, res })
				p.lineTotal = processLineTotalSrvc({ price: p.product.price, quantity: p.quantity })
				//console.log(p.finalPrice)
				//log({ level: 'debug', message: 'process products', data: p })
				price.total.tnd += p.lineTotal.tnd
				price.total.eur += p.lineTotal.eur
				price.total.usd += p.lineTotal.usd
			}

			//check if there is alreay pending purchases from that business
			const purchases = await findOrdersSrvc({ match: { customer: { _id: customer._id }, business: { _id: business._id }, status: ORDER_STATUSES.PENDING_BUSINESS_CONFIRMATION } })
			if (purchases.docs.length > 0) {
				//TODO: check each product has the still the same price as in db
				//if yes just add quantity
				//if no add it as another product (push to products array)
				for (let purchase of purchases.docs) {
				}

				//update the purchase
				//const updatedOrder = await updateOrderSrvc({ orderId: purchase._id, data: { products } })
				//return resp({ status: 200, data: updatedOrder, req, res })
			}
			const data = { customer, business, products, price, status: ORDER_STATUSES.PENDING_BUSINESS_CONFIRMATION }
			const createPurchase = await createPurchaseSrvc(data)
			return resp({ status: 201, data: createPurchase, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})

router.route('/sales').get(authenticate({ role: 'business_owner' }), async (req, res) => {
	try {
		const match = { business: { owner: { _id: req.user._id } } }
		const select = ''
		let { page = 1, limit = 10 } = req.query
		const fetchedOrders = await findOrdersSrvc({ match, select, page, limit })
		return resp({ status: 200, data: fetchedOrders, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/:orderId/').patch(authenticate({ role: USER_ROLES.CUSTOMER }), validate(patchOrderStatusVld), async (req, res) => {
	try {
		const { orderId } = req.params
		const { status } = req.body
		const match = { _id: orderId, customer: { _id: req.user._id } }
		const purchase = await findOneOrderSrvc({ match })
		if (!purchase) return resp({ status: 202, message: `purchase not found ${JSON.stringify(match)}`, data: null, req, res })
		const patchedOrder = await patchOrderStatusSrvc({ match, oldStatus: purchase.status, newStatus: status })
		if (!patchedOrder.data) return resp({ status: 409, message: patchedOrder.message, data: null, req, res })
		return resp({ status: 200, message: patchedOrder.message, data: patchedOrder.data, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})
export default router
