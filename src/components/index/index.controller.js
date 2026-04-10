import express from 'express'
import config from '../../config/index.js'
import { resp } from '../../core/helpers/resp.js'
import { formatUptime } from '../../core/helpers/filters.js'
const router = express.Router()

router.get('/', function (req, res, next) {
	const { NODE_ENV, app, frontend } = config
	const NODE_VERSION = process.version
	const uptime = formatUptime(process.uptime())

	const data = { NODE_ENV, app, NODE_VERSION, uptime, frontend }
	return resp({ status: 200, label: 'success', message: 'success', data, req, res })
})

export default router
