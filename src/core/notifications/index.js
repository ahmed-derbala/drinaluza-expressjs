import { createNotificationRepo } from './notifications.repository.js'

export const notify = async ({ userIds, kind, at, title, content }) => {
	let success = true
	userIds.forEach((userId) => {
		createNotificationRepo({ user: { _id: userId }, kind, at, title, content })
	})
	return success
}
