import { createNotificationSrvc } from './notifications.service.js'
import { templateRegistry } from './templates.helper.js'
import { log } from '../log/index.js'
import { findSessionsSrvc } from '../sessions/sessions.service.js'
import { Expo } from 'expo-server-sdk'
import { getIO } from '../socketio/index.js'

const expo = new Expo()

/**
 *
 * @param {*} param0
 * @returns
 */
export const notify = async ({ user, template, screen = '/notifications', kind, priority = 'high', media, data = {} }) => {
	const io = getIO() // Call the function to get the current live instance
	if (!user.settings) {
		if (!user.settings.language) {
			user = await findOneUserSrvc({ match: { _id: user._id }, select: '+settings' })
		}
	}
	console.log('notify called with:', { user })

	if (!template && !template.slug) {
		throw 'templateSlug is required'
	}

	const templateFn = templateRegistry[template.slug]
	const { title, content } = templateFn(data)
	createNotificationSrvc({ user, template, screen, title, content, kind, priority, media, ...data })
	if (io) {
		io.to(user.slug).emit('new_notification', { template, title, content, screen, media, priority })
		//log({ level: 'info', label: 'notifications', message: 'Notification emitted via socket.io', data: { template,title, content, screen, media, priority } })
	}

	const allowedNotificationKinds = ['push', 'email', 'sms']
	// Handle Push Logic
	if (allowedNotificationKinds.includes('push')) {
		//fecth sessions
		const sessions = await findSessionsSrvc({ match: { 'user.slug': user.slug, expoPushToken: { $exists: true } }, select: '-_id expoPushToken' })

		if (!sessions || sessions.length === 0) {
			log({ level: 'warn', label: 'notifications', message: `No expoPushToken found for user ${user.slug}`, data: { user } })
			return
		}
		const messages = []
		data.screen = screen //so when tapping on push notification on device it opens the target screen
		let richContent = {} //for rich content like images, videos, etc.
		if (media) {
			if (media.thumbnail) {
				if (media.thumbnail.url) {
					richContent = { image: media.thumbnail.url }
				}
			}
		}

		for (let s of sessions) {
			if (!s.expoPushToken) continue
			// Check that all your push tokens appear to be valid Expo push tokens
			//console.log('Checking Expo push token:', s.expoPushToken)
			if (!Expo.isExpoPushToken(s.expoPushToken)) {
				log({ level: 'error', label: 'notifications', message: `Push token ${s.expoPushToken} is not a valid Expo push token` })
				continue
			}
			console.log(richContent, 'richContent')
			messages.push({
				to: s.expoPushToken,
				sound: 'default',
				title: title[user.settings.language.content] || title['en'],
				body: content[user.settings.language.content] || content['en'],
				data, // Custom data for your frontend to handle
				richContent,
				channelId: 'default',
				priority
			})
		}

		// Chunk the messages to stay within Expo's limits
		let chunks = expo.chunkPushNotifications(messages)
		for (let chunk of chunks) {
			//console.log('Sending push notification chunk:', chunk)
			try {
				let ticket = await expo.sendPushNotificationsAsync(chunk)
				//console.log('Push notification ticket:', ticket)
			} catch (error) {
				log({ level: 'error', label: 'notifications', message: 'Error sending push notification chunk:', data: { error } })
			}
		}
	}
}
