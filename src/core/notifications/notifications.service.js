import { errorHandler } from '../error/index.js'
import { findNotificationsRepo, findOneNotificationRepo, updateOneNotificationRepo, createNotificationRepo } from './notifications.repository.js'

export const findNotificationsSrvc = async ({ match, page, limit, select }) => {
	try {
		const fetchedNotifications = await findNotificationsRepo({ match, page, limit, select })
		return fetchedNotifications
	} catch (err) {
		errorHandler({ err })
	}
}

export const findOneNotificationSrvc = async ({ match }) => {
	try {
		return await findOneNotificationRepo({ match })
	} catch (err) {
		errorHandler({ err })
	}
}

export const updateOneNotificationSrvc = async ({ match, newData }) => {
	try {
		return await updateOneNotificationRepo({ match, newData })
	} catch (err) {
		errorHandler({ err })
	}
}

export const createNotificationSrvc = async ({ user, kind, at, title, content }) => {
	return await createNotificationRepo({ user, kind, at, title, content })
}
