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
		const sessions = await findSessionsSrvc({ match: { 'user.slug': user.slug, expoPushToken: { $exists: true } }, select: '-_id expoPushToken' })
		console.log(sessions)

		if (!sessions || sessions.length === 0) {
			log({ level: 'debug', message: `No expoPushToken found for user ${user.slug}`, data: { user } })
			return
		}
		const messages = []

		for (let s of sessions) {
			if (!s.expoPushToken) continue
			// Check that all your push tokens appear to be valid Expo push tokens
			console.log('Checking Expo push token:', s.expoPushToken)
			if (!Expo.isExpoPushToken(s.expoPushToken)) {
				console.error(`Push token ${s.expoPushToken} is not a valid Expo push token`)
				continue
			}

			messages.push({
				to: s.expoPushToken,
				sound: 'default',
				title: title.en,
				body: content.en,
				data: { hi: 'hello' }, // Custom data for your frontend to handle
				channelId: 'default',
				priority: 'high'
			})
		}

		// Chunk the messages to stay within Expo's limits
		let chunks = expo.chunkPushNotifications(messages)
		for (let chunk of chunks) {
			console.log('Sending push notification chunk:', chunk)
			try {
				let ticket = await expo.sendPushNotificationsAsync(chunk)
				console.log('Push notification ticket:', ticket)
			} catch (error) {
				console.error('Error sending push notification chunk:', error)
			}
		}
	}
}
