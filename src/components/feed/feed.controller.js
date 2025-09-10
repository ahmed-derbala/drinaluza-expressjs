import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findManyProductsSrvc } from '../products/products.service.js'
import { errorHandler } from '../../core/error/index.js'
import { cardTypeEnum } from './feed.enum.js'
import { authenticate } from '../../core/auth/index.js'

const router = express.Router()
router
	.route('/')
	.get(authenticate(), async (req, res) => {
		try {
			const { match, select } = req.body || {}
			let { page = 1, limit = 10 } = req.query
			let products = await findManyProductsSrvc({ match, select, page, limit })
			products.data = products.data.map((p) => {
				p.card = {
					type: cardTypeEnum.product
				}

				//if user is owner of the shop
				if (p.shop.owner._id.toString() === req.user._id.toString()) {
					p.card.order = {
						isActive: true
					}
				}

				return p
			})
			return resp({ status: 200, data: products, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(() => {})
export default router
