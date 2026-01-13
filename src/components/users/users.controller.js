import express from 'express'
import { authenticate } from '../../core/auth/index.js'
import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import { resp } from '../../core/helpers/resp.js'
import { validate } from '../../core/validation/index.js'
import { findOneProfileSrvc, updateMyProfileSrvc, findMyProfileSrvc } from './users.service.js'
import { patchMyProfileVld } from './users.validator.js'
const router = express.Router()

/*
router.get('/:slug', async (req, res) => {
	const { slug } = req.params
	const user = await findOneUserSrvc({ match: { slug } })
	if (!user) return resp({ status: 202, message: 'user not found', data: null, req, res })
	return resp({ status: 200, message: 'user found', data: user, req, res })
})
*/

router
	.route('/my-profile')
	.get(authenticate(), async (req, res) => {
		try {
			const user = req.user
			const myProfile = await findMyProfileSrvc({ user })
			return resp({ status: 200, data: myProfile, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.patch(
		authenticate(),
		//validate(patchMyProfileVld),
		async (req, res) => {
			try {
				const user = req.user
				const myUpdatedProfile = await updateMyProfileSrvc({ user, newData: req.body })
				return resp({ status: 200, data: myUpdatedProfile, req, res })
			} catch (err) {
				errorHandler({ err, req, res })
			}
		}
	)

router
	.route('/:userSlug/profile')
	.get(async (req, res) => {
		try {
			const match = { slug: req.params.userSlug }
			const profile = await findOneProfileSrvc({ match })
			return resp({ status: 200, data: profile, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(authenticate(), async (req, res) => {
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

export default router
