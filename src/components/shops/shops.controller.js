import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findMyShopsSrvc, createShopSrvc, findMyShopSrvc, findOneShopSrvc } from './shops.service.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { createProductSrvc, findManyProductsSrvc } from '../products/products.service.js'
import { createShopVld } from './shops.validator.js'
import { validate } from '../../core/validation/index.js'
import { addShopToUserSrvc } from '../users/users.service.js'

const router = express.Router()

router.route('/').post(authenticate(), validate(createShopVld), async (req, res) => {
	try {
		let { name } = req.body
		let data = { name, owner: req.user }
		const newShop = await createShopSrvc({ data })
		if (newShop) {
			addShopToUserSrvc({ shop: newShop, userId: req.user._id })
		}
		return resp({ status: newShop.status || 200, data: newShop, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/my-shops').get(authenticate(), async (req, res) => {
	try {
		let match = {}
		match.owner = { _id: req.user._id }
		const select = ''
		let { page = 1, limit = 10 } = req.query
		const myShops = await findMyShopsSrvc({ match, select, page, limit })
		return resp({ status: 200, data: myShops, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/my-shops/:shopId/').get(authenticate(), async (req, res) => {
	try {
		let match = {}
		match.owner = { _id: req.user._id }
		const shopId = req.params.shopId
		//match.shop = {}
		match._id = shopId
		//match.shop.owner = { _id: req.user._id }
		const myShopProducts = await findOneShopSrvc({ match })
		console.log(myShopProducts)
		return resp({ status: 200, data: myShopProducts, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/my-shops/:shopId/products').get(authenticate(), async (req, res) => {
	try {
		let match = {}
		//match.owner = { _id: req.user._id }
		const select = ''
		let { page = 1, limit = 10 } = req.query
		const shopId = req.params.shopId
		match.shop = {}
		match.shop._id = shopId
		match.shop.owner = { _id: req.user._id }
		const myShopProducts = await findManyProductsSrvc({ match, select, page, limit })
		console.log(myShopProducts)
		return resp({ status: 200, data: myShopProducts, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/my-shops/:shopId/products/create').post(authenticate(), async (req, res) => {
	try {
		const shopId = req.params.shopId
		const { name, price, photos, searchTerms, availability, stock } = req.body
		const shop = await findMyShopSrvc({ match: { _id: shopId, owner: { _id: req.user._id } }, select: '' })
		if (!shop) return resp({ status: 202, message: 'shop not found', data: null, req, res })

		const data = { shop, owner: req.user, name, price, photos, searchTerms, availability, stock }
		const shopProduct = await createProductSrvc({ data })
		return resp({ status: shopProduct.status || 200, data: shopProduct, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

export default router
