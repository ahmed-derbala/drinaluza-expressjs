import express from 'express'
import config from '../../config/index.js'
import { errorHandler } from '../error/index.js'
import { resp } from '../helpers/resp.js'
const router = express.Router()

function formatUptime(seconds) {
	const days = Math.floor(seconds / (24 * 60 * 60))
	seconds %= 24 * 60 * 60

	const hours = Math.floor(seconds / (60 * 60))
	seconds %= 60 * 60

	const minutes = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)

	return `${days} days, ${hours} hours, ${minutes} minutes, ${secs} seconds`
}

router.route('/').get(async (req, res) => {
	try {
		const data = {
			status: 'ok',
			version: config.version,
			uptime: formatUptime(process.uptime()),
			NODE_VERSION: process.version
		}

		return resp({ status: 200, data, req, res })
	} catch (err) {
		return errorHandler({ err, req, res })
	}
})

export default router
