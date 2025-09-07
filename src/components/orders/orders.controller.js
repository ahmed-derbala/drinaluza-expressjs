import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findManyOrdersSrvc, createOrderSrvc, findOneOrderSrvc, patchOrderStatusSrvc } from './orders.service.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { createOrderVld, patchOrderStatusVld } from './orders.validator.js'
import { validate } from '../../core/validation/index.js'
import { findOneProductSrvc } from '../products/products.service.js'
import { orderStatusEnum } from './orders.enum.js'
import { findOneShopSrvc } from '../shops/shops.service.js'
import { calculateFinalPriceSrvc } from './orders.service.js'
import { log } from '../../core/log/index.js'
import { userRolesEnum } from '../users/users.enum.js'

const router = express.Router()
router
	.route('/')
	.get(authenticate(), async (req, res) => {
		try {
			const match = { customer: { _id: req.user._id } }
			let { page = 1, limit = 10 } = req.query
			const fetchedManyOrders = await findManyOrdersSrvc({ match, page, limit })
			return resp({ status: 200, data: fetchedManyOrders, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(authenticate(), validate(createOrderVld), async (req, res) => {
		try {
			const customer = req.user
			let { products, shop } = req.body
			//process products
			for (let p of products) {
				p.product = await findOneProductSrvc({ match: { slug: p.product.slug } })
				p.finalPrice = calculateFinalPriceSrvc({ price: p.product.price, quantity: p.quantity })
				log({ level: 'debug', message: 'process products', data: p })
			}
			shop = await findOneShopSrvc({ match: { slug: shop.slug }, select: '' })
			if (!shop) return resp({ status: 202, message: 'shop not found', data: null, req, res })
			const data = { customer, shop, products, status: orderStatusEnum.PENDING_SHOP_CONFIRMATION }
			const createdOrder = await createOrderSrvc({ data })
			return resp({ status: 201, data: createdOrder, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})

router.route('/:orderId/status').patch(
	authenticate(),
	/*validate(createOrderVld),*/ async (req, res) => {
		try {
			const owner = req.body?.owner || req.user
			const { products } = req.body
			//process products
			for (p of products) {
				p = await findOneProductSrvc({ match: { _id: p.product._id } })
			}
			const shop = products[0].product.shop
			const data = { owner, shop, products, status: orderStatusEnum.PENDING_SHOP_CONFIRMATION }
			//console.log('data',data)
			const createdOrder = await createOrderSrvc({ data })
			//console.log(createdOrder)
			return resp({ status: 201, data: createdOrder, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	}
)

router.route('/sales').get(authenticate({ role: 'shop_owner' }), async (req, res) => {
	try {
		const match = { shop: { owner: { _id: req.user._id } } }
		const select = ''
		let { page = 1, limit = 10 } = req.query
		const fetchedManyOrders = await findManyOrdersSrvc({ match, select, page, limit })
		return resp({ status: 200, data: fetchedManyOrders, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/sales/:orderId/:status').patch(authenticate({ role: userRolesEnum.SHOP_OWNER }), validate(patchOrderStatusVld), async (req, res) => {
	try {
		const { status, orderId } = req.params
		const match = { _id: orderId, shop: { owner: { _id: req.user._id } } }
		const order = await findOneOrderSrvc({ match })
		if (!order) return resp({ status: 202, message: `order not found ${JSON.stringify(match)}`, data: null, req, res })
		const patchedOrder = await patchOrderStatusSrvc({ match, oldStatus: order.status, newStatus: status })
		if (!patchedOrder.data) return resp({ status: 409, message: patchedOrder.message, data: null, req, res })
		return resp({ status: 200, message: patchedOrder.message, data: patchedOrder.data, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})
export default router
