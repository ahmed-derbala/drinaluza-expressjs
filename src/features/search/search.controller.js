import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { validate } from '../../core/validation/index.js'
import { searchVld } from './search.validator.js'
import { searchProductsSrvc } from './search.service.js'
const router = express.Router()

router.route('/').get(
	//authenticate({ tokenRequired: false }),
	validate(searchVld),
	async (req, res) => {
		try {
			let { page = 1, limit = 10, q, scopes } = req.query
			if (!scopes) {
				scopes = ['products']
			}

			let searchResults = {}
			if (scopes.includes('products')) {
				const productsSearch = await searchProductsSrvc({ text: q, select: '', page, limit })
				searchResults = productsSearch
			}

			return resp({ status: 200, data: searchResults, req, res })
		} catch (err) {
			return errorHandler({ err, req, res })
		}
	}
)

export default router
