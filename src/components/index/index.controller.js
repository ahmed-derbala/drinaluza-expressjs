import express from 'express'
import config from '../../config/index.js'
import { resp } from '../../core/helpers/resp.js'
const router = express.Router()

router.get('/', function (req, res, next) {
	const { NODE_ENV, app } = config
	const NODE_VERSION = process.version
	return resp({ status: 200, label: 'success', message: 'success', data: { NODE_ENV, app, NODE_VERSION }, req, res })
})

export default router
