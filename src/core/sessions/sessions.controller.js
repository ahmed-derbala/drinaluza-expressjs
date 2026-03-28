import express from 'express'
import config from '../../config/index.js'
import { validate } from '../validation/index.js'
import { expoPushTokenVld } from './sessions.validator.js'
import { errorHandler } from '../error/index.js'
import { resp } from '../helpers/resp.js'
import { SessionsModel } from './sessions.schema.js'
import { log } from '../log/index.js'
import { authenticate } from '../auth/index.js'
const router = express.Router()

router
	.route('/expo-push-token')
	.post(authenticate(), validate(expoPushTokenVld), async (req, res) => {
		const { expoPushToken, token } = req.body
		let session = await SessionsModel.findOne({ user: req.user._id, token })
		if (!session) {
			return resp({ status: 404, message: 'Session not found', data: null, req, res })
		}
		if (session.expoPushToken) {
			return resp({ status: 409, message: 'Expo push token already exists', data: null, req, res })
		}

		session.expoPushToken = expoPushToken
		await session.save()

		return resp({ status: 200, message: 'Expo push token saved', data: { session }, req, res })
	})
	.get(authenticate(), async (req, res) => {
		const { token } = req.query
		let session = await SessionsModel.findOne({ user: req.user._id, token })
		if (!session) {
			return resp({ status: 404, message: 'Session not found', data: null, req, res })
		}
		return resp({ status: 200, message: 'Session found', data: { session }, req, res })
	})

export default router
