import { errorHandler } from '../error/index.js'
import { findNotificationsRepo, findOneNotificationRepo, updateOneNotificationRepo, createNotificationRepo } from './notifications.repository.js'
import { log } from '../log/index.js'

export const findNotificationsSrvc = async ({ match, page, limit, select }) => {
	try {
		const fetchedNotifications = await findNotificationsRepo({ match, page, limit, select })
		return fetchedNotifications
	} catch (err) {
		errorHandler({ err })
	}
}

export const findOneNotificationSrvc = async ({ match }) => {
	let notification = await findOneNotificationRepo({ match })
	if (notification) {
		if (!notification.seenAt) {
			notification = await updateOneNotificationRepo({ match, newData: { seenAt: Date.now() } })
		}
	}
	return notification
}

export const updateOneNotificationSrvc = async ({ match, newData }) => {
	try {
		return await updateOneNotificationRepo({ match, newData })
	} catch (err) {
		errorHandler({ err })
	}
}

export const createNotificationSrvc = async ({ user, template, screen, title, content, kind, priority, customer }) => {
	log({ level: 'info', label: 'notifications', message: 'createNotificationSrvc', data: { user, template, screen, title, content, kind, priority, customer } })

	const createdNotification = await createNotificationRepo({ user, template, screen, title, content, kind, priority, customer })
	return createdNotification
}
