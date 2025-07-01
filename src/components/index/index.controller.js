import express from 'express'
import config from '../../config/index.js'
const router = express.Router()
router.get('/', function (req, res, next) {
	const { NODE_ENV, app } = config
	return res.status(200).json({ NODE_ENV, app })
})
export default router
