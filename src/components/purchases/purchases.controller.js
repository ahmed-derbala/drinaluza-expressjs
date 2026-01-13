import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findOneOrderSrvc, patchOrderStatusSrvc } from './purchases.service.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { createPurchaseVld, patchOrderStatusVld } from './purchases.validator.js'
import { validate } from '../../core/validation/index.js'
import { findOneProductSrvc } from '../products/products.service.js'
import { orderStatusEnum } from '../orders/orders.enum.js'
import { findOneShopSrvc } from '../shops/shops.service.js'
import { processLineTotalSrvc, createPurchaseSrvc } from './purchases.service.js'
import { log } from '../../core/log/index.js'
import { userRolesEnum } from '../users/users.enum.js'
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
			let { products, shop } = req.body
			//check shop
			shop = await findOneShopSrvc({ match: { slug: shop.slug } })
			if (!shop) return resp({ status: 404, message: 'shop not found', data: null, req, res })
			const customer = await findOneCustomerSrvc({ match: { slug: req.user.slug } })
			log({ level: 'debug', message: 'create purchase', data: { customer, shop } })
			//shop_owner cannot purchase from his shops
			if (customer.role === userRolesEnum.SHOP_OWNER) {
				const ownedShop = await findOneShopSrvc({ match: { owner: { _id: customer._id }, slug: shop.slug }, select: '_id' })
				if (ownedShop) return resp({ status: 409, message: 'shop owners cannot purchase from their own shops', data: null, req, res })
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
				p.product = await findOneProductSrvc({ match, select: '+media' })
				if (!p.product) return resp({ status: 404, data: null, message: `product ${JSON.stringify(match)} not found`, req, res })
				p.lineTotal = processLineTotalSrvc({ price: p.product.price, quantity: p.quantity })
				//console.log(p.finalPrice)
				//log({ level: 'debug', message: 'process products', data: p })
				price.total.tnd += p.lineTotal.tnd
				price.total.eur += p.lineTotal.eur
				price.total.usd += p.lineTotal.usd
			}

			//check if there is alreay pending purchases from that shop
			const purchases = await findOrdersSrvc({ match: { customer: { _id: customer._id }, shop: { _id: shop._id }, status: orderStatusEnum.PENDING_SHOP_CONFIRMATION } })
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
			const data = { customer, shop, products, price, status: orderStatusEnum.PENDING_SHOP_CONFIRMATION }
			//console.log(data.products[0].finalPrice,'data')
			const createPurchase = await createPurchaseSrvc(data)
			return resp({ status: 201, data: createPurchase, req, res })
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
		const fetchedOrders = await findOrdersSrvc({ match, select, page, limit })
		return resp({ status: 200, data: fetchedOrders, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/:orderId/').patch(authenticate({ role: userRolesEnum.SHOP_OWNER }), validate(patchOrderStatusVld), async (req, res) => {
	try {
		const { orderId } = req.params
		const { status } = req.body
		const match = { _id: orderId, shop: { owner: { _id: req.user._id } } }
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
