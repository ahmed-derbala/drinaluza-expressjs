import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findManyProductsSrvc, createProductSrvc } from './products.service.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { validate } from '../../core/validation/index.js'
import { createProductVld } from './products.validator.js'
import { findOneShopRepo } from '../shops/shops.repository.js'
import { log } from '../../core/log/index.js'
const router = express.Router()

router
	.route('/')
	.get(async (req, res) => {
		try {
			const { match, select } = req.body || {}
			let { page = 1, limit = 10 } = req.query
			const fetchedManyProducts = await findManyProductsSrvc({ match, select, page, limit })
			return resp({ status: 200, data: fetchedManyProducts, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(authenticate(), validate(createProductVld), async (req, res) => {
		try {
			const { name, defaultProduct, price } = req.body
			let { shop } = req.body
			shop = await findOneShopRepo({ match: { slug: shop.slug }, select: '' })
			if (!shop) return resp({ status: 202, message: 'shop not found', data: null, req, res })
			const data = { shop, name, defaultProduct, price }
			log({ level: 'debug', message: 'createdProduct data', data: JSON.stringify(data) })
			const createdProduct = await createProductSrvc({ data })
			return resp({ status: 201, data: createdProduct, req, res })
		} catch (err) {
			return errorHandler({ err, req, res })
		}
	})

router
	.route('/my-products')
	.get(authenticate(), async (req, res) => {
		try {
			let match = {}
			match.shop = { owner: { _id: req.user._id } }
			const select = ''
			let { page = 1, limit = 10 } = req.query
			const fetchedManyProducts = await findManyProductsSrvc({ match, select, page, limit })
			return resp({ status: 200, data: fetchedManyProducts, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(authenticate(), async (req, res) => {
		try {
			const owner = req.user
			const { shop, name, defaultProduct, price } = req.body
			const data = { shop, owner, name, defaultProduct, price }
			const createdProduct = await createProductSrvc({ data })
			return resp({ status: 201, data: createdProduct, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
export default router
