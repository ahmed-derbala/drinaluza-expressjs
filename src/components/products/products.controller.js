import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findManyProductsSrvc, createProductSrvc } from './products.service.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
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
	.post(authenticate(), async (req, res) => {
		try {
			const createdByUser = req.user
			const { shop, name, defaultProduct, price } = req.body
			const data = { shop, createdByUser, name, defaultProduct, price }
			const createdProduct = await createProductSrvc({ data })
			//console.log(createdProduct)
			return resp({ status: 201, data: createdProduct, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
export default router
