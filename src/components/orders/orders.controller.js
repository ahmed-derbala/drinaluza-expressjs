import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findManyOrdersSrvc, createOrderSrvc } from './orders.service.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { createOrderVld } from './orders.validator.js'
import { validate } from '../../core/validation/index.js'
import { findOneProductSrvc } from '../products/products.service.js'
import { orderStatusEnum } from './orders.enum.js'
import { findOneShopSrvc } from '../shops/shops.service.js'
import { calculateFinalPriceSrvc } from './orders.service.js'
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
			const customer = req.user
			let { products, shop } = req.body
			//process products
			for (let p of products) {
				p.product = await findOneProductSrvc({ match: { slug: p.product.slug } })
				console.log(p)

				p.finalPrice = calculateFinalPriceSrvc({ price: p.product.price.value.tnd, quantity: p.quantity })
			}
			shop = await findOneShopSrvc({ match: { slug: shop.slug }, select: '' })
			if (!shop) return resp({ status: 202, message: 'shop not found', data: null, req, res })

			const data = { customer, shop, products, status: orderStatusEnum.PENDING_SHOP_CONFIRMATION }
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
export default router
