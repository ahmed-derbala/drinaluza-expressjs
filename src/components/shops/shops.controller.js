import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findMyShopsSrvc, createShopSrvc, findMyShopSrvc, findOneShopSrvc, findShopsSrvc } from './shops.service.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { createProductSrvc, findManyProductsSrvc } from '../products/products.service.js'
import { createShopVld } from './shops.validator.js'
import { validate } from '../../core/validation/index.js'
import { addShopToUserSrvc } from '../users/users.service.js'
import { findOneBusinessSrvc, createBusinessSrvc, addShopToBusinessSrvc } from '../businesses/businesses.service.js'
import { stateEnum } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { log } from '../../core/log/index.js'
const router = express.Router()

router
	.route('/')
	.post(authenticate({ role: 'shop_owner' }), validate(createShopVld), async (req, res) => {
		try {
			const { name, address, location } = req.body
			const owner = req.user

			//create new business if not exists
			let myBusiness = await findOneBusinessSrvc({ match: { owner: { _id: req.user._id } }, select: '' })
			log({ level: 'debug', data: myBusiness, message: 'myBusiness' })
			if (!myBusiness) {
				myBusiness = await createBusinessSrvc({ owner })
			}
			if (myBusiness && myBusiness.state.code != stateEnum.ACTIVE) {
				return resp({ status: 409, data: { message: `Business is ${myBusiness.state.code}` }, req, res })
			}

			owner.business = myBusiness
			const newShop = await createShopSrvc({ name, address, location, owner })

			if (newShop) {
				addShopToUserSrvc({ shop: newShop, userId: req.user._id })
				//add shop to business
				addShopToBusinessSrvc({ businessId: myBusiness._id, shop: newShop })
			}
			return resp({ status: newShop.status || 200, data: newShop, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.get(async (req, res) => {
		try {
			const shops = await findShopsSrvc({})
			return resp({ status: 200, data: shops, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})

router.route('/my-shops').get(authenticate({ role: 'shop_owner' }), async (req, res) => {
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

router.route('/my-shops/:shopSlug/').get(authenticate(), async (req, res) => {
	try {
		let match = {}
		match.owner = { _id: req.user._id }
		const shopSlug = req.params.shopSlug
		//match.shop = {}
		match.slug = shopSlug
		const myShopProducts = await findOneShopSrvc({ match })
		return resp({ status: 200, data: myShopProducts, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/my-shops/:shopSlug/products').get(authenticate(), async (req, res) => {
	try {
		let match = {}
		//match.owner = { _id: req.user._id }
		const select = ''
		let { page = 1, limit = 10 } = req.query
		const shopSlug = req.params.shopSlug
		match.shop = {}
		match.shop.slug = shopSlug
		match.shop.owner = { _id: req.user._id }
		const myShopProducts = await findManyProductsSrvc({ match, select, page, limit })
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

router.route('/:shopSlug').get(async (req, res) => {
	try {
		const shopSlug = req.params.shopSlug
		let match = {}
		match.slug = shopSlug
		const shop = await findOneShopSrvc({ match })
		return resp({ status: 200, data: shop, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/:shopSlug/products').get(async (req, res) => {
	try {
		let match = {}
		const select = ''
		let { page = 1, limit = 10 } = req.query
		const shopSlug = req.params.shopSlug
		match.shop = {}
		match.shop.slug = shopSlug
		const shopProducts = await findManyProductsSrvc({ match, select, page, limit })
		return resp({ status: 200, data: shopProducts, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})
export default router
