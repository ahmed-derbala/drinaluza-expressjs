import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findManyOrdersSrvc, createOrderSrvc } from './orders.service.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { createOrderVld } from './orders.validator.js'
import { validate } from '../../core/validation/index.js'
import { findOneProductSrvc } from '../products/products.service.js'
import { orderStatusEnum } from './orders.enum.js'
const router = express.Router()
router
	.route('/')
	.get(async (req, res) => {
		try {
			const { match, select } = req.body || {}
			let { page = 1, limit = 10 } = req.query
			const fetchedManyOrders = await findManyOrdersSrvc({ match, select, page, limit })
			return resp({ status: 200, data: fetchedManyOrders, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(authenticate(), validate(createOrderVld), async (req, res) => {
		try {
			const createdByUser = req.body?.createdByUser || req.user
			const { products } = req.body
			//process products
			for (let p of products) {
				p = await findOneProductSrvc({ match: { _id: p.product._id } })
			}
			const business = products[0].product.business
			const shop = products[0].product.shop
			const data = { createdByUser, business, shop, products, status: orderStatusEnum.PENDING_SHOP_CONFIRMATION }
			//console.log('data',data)
			const createdOrder = await createOrderSrvc({ data })
			//console.log(createdOrder)
			return resp({ status: 201, data: createdOrder, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
router.route('/:orderId/status').patch(
	authenticate(),
	/*validate(createOrderVld),*/ async (req, res) => {
		try {
			const createdByUser = req.body?.createdByUser || req.user
			const { products } = req.body
			//process products
			for (p of products) {
				p = await findOneProductSrvc({ match: { _id: p.product._id } })
			}
			const business = products[0].product.business
			const shop = products[0].product.shop
			const data = { createdByUser, business, shop, products, status: orderStatusEnum.PENDING_SHOP_CONFIRMATION }
			//console.log('data',data)
			const createdOrder = await createOrderSrvc({ data })
			//console.log(createdOrder)
			return resp({ status: 201, data: createdOrder, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	}
)
export default router
