import express from 'express'
import config from '#config'
import { errorHandler } from '#error'
import { resp } from '#helpers/resp.js'
import { formatUptime } from '#helpers/filters.js'
import { getPublicSocket, getPrivateSocket } from '#socketio'
const router = express.Router()

router.route('/').get(async (req, res) => {
	try {
		const { node, app } = config
		const uptime = formatUptime(process.uptime())
		const publicClientsCount = getPublicSocket().clientsCount
		const privateClientsCount = getPrivateSocket().clientsCount
		const data = { node, app, uptime, socketio: { publicClientsCount, privateClientsCount } }
		return resp({ status: 200, label: 'health', message: 'success', data, req, res })
	} catch (err) {
		return errorHandler({ err, req, res })
	}
})

export default router
