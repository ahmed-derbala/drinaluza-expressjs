import express from 'express'
import { validate } from '../validation/index.js'
import { resp } from '../helpers/resp.js'
import { findNotificationsSrvc, createNotificationSrvc, updateOneNotificationSrvc } from './notifications.service.js'
import { authenticate } from '../auth/index.js'
import { errorHandler } from '../error/index.js'
import { patchNotificationVld } from './notifications.validator.js'
const router = express.Router()

router
	.route('/')
	.get(authenticate(), async (req, res) => {
		const userId = req.user._id
		const { page = 1, limit = 10 } = req.query
		const notifications = await findNotificationsSrvc({ match: { user: { _id: userId } }, page, limit })
		return resp({ status: 200, data: notifications, req, res })
	})
	.post(authenticate(), async (req, res) => {
		try {
			const { kind, at, title, content } = req.body
			const notification = await createNotificationSrvc({ user: req.user, kind, at, title, content })
			return resp({ status: 200, data: notification, req, res })
		} catch (err) {
			return errorHandler({ err, req, res })
		}
	})

router
	.route('/:notificationId')
	.get(authenticate(), async (req, res) => {
		const userId = req.user._id
		const { page = 1, limit = 10 } = req.query
		const notifications = await findNotificationsSrvc({ match: { user: { _id: userId }, _id: req.params.notificationId }, page, limit })
		return resp({ status: 200, data: notifications, req, res })
	})
	.patch(authenticate(), validate(patchNotificationVld), async (req, res) => {
		const { seenAt } = req.body
		const newData = { seenAt }
		const match = { user: { _id: req.user._id }, _id: req.params.notificationId }
		const patchedNotification = await updateOneNotificationSrvc({ match, newData })
		return resp({ status: 200, data: patchedNotification, req, res })
	})

export default router
