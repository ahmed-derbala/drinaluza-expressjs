import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findManyProductsSrvc, createProductSrvc, findOneProductSrvc } from './products.service.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { validate } from '../../core/validation/index.js'
import { createProductVld, findOneProductVld } from './products.validator.js'
import { findOneBusinessRepo } from '../businesses/businesses.repository.js'
import { log } from '../../core/log/index.js'
import { findOneDefaultProductSrvc } from '../default-products/default-products.service.js'
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
			const { price, unit } = req.body
			let { business, defaultProduct, name } = req.body

			defaultProduct = await findOneDefaultProductSrvc({ slug: defaultProduct.slug })
			business = await findOneBusinessRepo({ match: { slug: business.slug }, select: '' })
			if (!business) return resp({ status: 202, message: 'business not found', data: null, req, res })

			const data = { business, name, defaultProduct, price, unit }
			log({ level: 'debug', message: 'createdProduct data', data })
			const createdProduct = await createProductSrvc(data)
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
			match.business = { owner: { _id: req.user._id } }
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
			const { business, name, defaultProduct, price } = req.body
			const data = { business, owner, name, defaultProduct, price }
			const createdProduct = await createProductSrvc({ data })
			return resp({ status: 201, data: createdProduct, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})

//this should be always after GET '/products/'
router.route('/:productSlug').get(validate(findOneProductVld), async (req, res) => {
	try {
		const product = await findOneProductSrvc({ match: { slug: req.params.productSlug } })
		return resp({ status: 200, data: product, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

export default router
