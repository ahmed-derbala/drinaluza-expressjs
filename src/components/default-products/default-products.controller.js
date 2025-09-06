import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findManyDefaultProductSrvc } from './default-products.service.js'
import { errorHandler } from '../../core/error/index.js'
const router = express.Router()
router
	.route('/')
	.get(async (req, res) => {
		try {
			const { match, select } = req.body || {}
			let { page = 1, limit = 10 } = req.query
			const fetchedManyDefaultProduct = await findManyDefaultProductSrvc({ match, select, page, limit })
			return resp({ status: 200, data: fetchedManyDefaultProduct, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(() => {})
export default router
