import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findMyShopsSrvc, createShopSrvc } from './shops.service.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
const router = express.Router()

router.route('/my-shops').get(authenticate(), async (req, res) => {
	try {
		let match = {}
		match.createdByUser = { _id: req.user._id }
		const select = ''
		let { page = 1, limit = 10 } = req.query
		const myShops = await findMyShopsSrvc({ match, select, page, limit })
		return resp({ status: 200, data: myShops, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})
/*.post(authenticate(), async (req, res) => {
		try {
			const createdByUser = req.user
			const { business, shop, name, defaultProduct, price } = req.body
			const data = { business, shop, createdByUser, name, defaultProduct, price }
			const createdProduct = await createProductSrvc({ data })
			//console.log(createdProduct)
			return resp({ status: 201, data: createdProduct, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})*/

router.route('/create').post(authenticate(), async (req, res) => {
	try {
		let { name } = req.body
		let data = { name, createdByUser: req.user }
		const newShop = await createShopSrvc({ data })
		return resp({ status: newShop.status || 200, data: newShop, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})
export default router
