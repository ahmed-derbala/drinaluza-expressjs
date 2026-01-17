import express from 'express'
import config from '../../config/index.js'
import { errorHandler } from '../error/index.js'
import { resp } from '../helpers/resp.js'
import { formatUptime } from '../helpers/filters.js'

const router = express.Router()

router.route('/').get(async (req, res) => {
	try {
		const data = {
			status: 'ok',
			uptime: formatUptime(process.uptime()),
			NODE_VERSION: process.version
		}

		return resp({ status: 200, data, req, res })
	} catch (err) {
		return errorHandler({ err, req, res })
	}
})

export default router
