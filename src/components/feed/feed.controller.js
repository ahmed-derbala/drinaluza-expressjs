import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findFeedSrvc } from './feed.service.js'
import { errorHandler } from '../../core/error/index.js'
import { cardTypeEnum } from './feed.enum.js'
import { authenticate } from '../../core/auth/index.js'

const router = express.Router()
router
	.route('/')
	.get(authenticate({ tokenRequired: false }), async (req, res) => {
		try {
			let { page = 1, limit = 10, filter, select } = req.query
			const filterArray = filter ? filter.split(',') : []
			const match = filterArray.length > 0 ? { targetResource: { $in: filterArray } } : {}
			let feed = await findFeedSrvc({ match, select, page, limit })
			feed.docs = feed.docs.map((f) => {
				if (f.card.kind == 'product') {
					//user conencted
					if (req.user) {
						//if user is owner of the shop
						if (f.targetData.shop.owner._id.toString() === req.user._id.toString()) {
							f.card.purchase = { allowed: false }
						}
					}
				}
				return f
			})
			return resp({ status: 200, data: feed, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(() => {})
export default router
