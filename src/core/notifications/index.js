import { createNotificationSrvc } from './notifications.service.js'
import { templateRegistry } from './templates.helper.js'
import { log } from '../log/index.js'
import { findSessionsSrvc } from '../sessions/sessions.service.js'
import { Expo } from 'expo-server-sdk'

const expo = new Expo()

/**
 *
 * @param {*} param0
 * @returns
 */
export const notify = async ({ user, kind = 'push', template, data = {} }) => {
	log({ level: 'debug', message: 'notify', data: { user, template, data } })
	if (!template && !template.slug) {
		throw 'templateSlug is required'
	}

	const templateFn = templateRegistry[template.slug]
	const { title, content } = templateFn({ user })
	createNotificationSrvc({ user, title, content, template, kind })

	// Handle Push Logic
	if (kind === 'push') {
		//fecth sessions
		const sessions = await findSessionsSrvc({ match: { 'user.slug': user.slug, expoPushToken: { $exists: true } }, select: 'expoPushToken' })
		console.log(sessions)

		if (!sessions || sessions.length === 0) {
			log({ level: 'debug', message: `No sessions found for user ${user.slug}`, data: { user } })
			return
		}
		const messages = []

		for (let s of sessions) {
			// Check that all your push tokens appear to be valid Expo push tokens
			if (!Expo.isExpoPushToken(s.expoPushToken)) {
				console.error(`Push token ${s.expoPushToken} is not a valid Expo push token`)
				continue
			}

			messages.push({
				to: s.expoPushToken,
				sound: 'default',
				title: title,
				body: content,
				data: data // Custom data for your frontend to handle
			})
		}

		// Chunk the messages to stay within Expo's limits
		let chunks = expo.chunkPushNotifications(messages)
		for (let chunk of chunks) {
			try {
				await expo.sendPushNotificationsAsync(chunk)
			} catch (error) {
				console.error('Error sending push notification chunk:', error)
			}
		}
	}
}
