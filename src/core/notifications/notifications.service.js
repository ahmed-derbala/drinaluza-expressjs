import { errorHandler } from '#error'
import { findNotificationsRepo, findOneNotificationRepo, updateOneNotificationRepo, createNotificationRepo } from './notifications.repository.js'
import { log } from '#log'

export const findNotificationsSrvc = async ({ match, page, limit, select }) => {
	const fetchedNotifications = await findNotificationsRepo({ match, page, limit, select })
	return fetchedNotifications
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
	return updateOneNotificationRepo({ match, newData })
}

export const createNotificationSrvc = async ({ user, template, screen, title, content, kind, priority, media }) => {
	//log({ level: 'info', label: 'notifications', message: 'createNotificationSrvc', data: { user, template, screen, title, content, kind, priority, media } })
	const createdNotification = await createNotificationRepo({ user, template, screen, title, content, kind, priority, media })
	return createdNotification
}
