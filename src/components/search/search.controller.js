import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { validate } from '../../core/validation/index.js'
import { searchVld } from './search.validator.js'
import { searchProductsSrvc } from './search.service.js'
const router = express.Router()

router.route('/').post(authenticate({ tokenRequired: false }), validate(searchVld), async (req, res) => {
	try {
		let { page = 1, limit = 10 } = req.query

		const { text, components } = req.body

		let searchResults = {}
		if (components.includes('products')) {
			const productsSearch = await searchProductsSrvc({ text, select: '', page, limit })
			searchResults = productsSearch
		}

		return resp({ status: 200, data: searchResults, req, res })
	} catch (err) {
		return errorHandler({ err, req, res })
	}
})

export default router
