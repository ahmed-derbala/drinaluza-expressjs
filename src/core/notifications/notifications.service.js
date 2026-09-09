import { errorHandler } from '../error/index.js'
import { findNotificationsRepo, findOneNotificationRepo, updateOneNotificationRepo, createNotificationRepo } from './notifications.repository.js'
import { notificationsTemplatesRegistry } from './notifications-templates.service.js'
import { log } from '#log'
import { findSessionsSrvc } from '../sessions/sessions.service.js'
import { Expo } from 'expo-server-sdk'
import { getPrivateSocket } from '#socketio'
import { findOneUserSrvc } from '#users/users.service.js'
import { USER_NOTIFICATION_ROOM_PREFIX } from '#core/socketio/socketio.constant.js'
const expo = new Expo()

/**
 *
 * @param {*} param0
 * @returns
 */
export const notify = async ({ user, template, screen = '/notifications', kind, priority = 'high', media }) => {
	const privateSio = getPrivateSocket().io // Call the function to get the current live instance

	if (!user.settings) {
		user.settings = {}
		if (!user.settings.language) {
			user = await findOneUserSrvc({ match: { _id: user._id }, select: '+settings' })
		}
	}

	if (!template) {
		throw 'template is required'
	}
	if (template && !template.slug) {
		throw 'templateSlug is required'
	}
	const templateFn = notificationsTemplatesRegistry[template.slug]
	const { title, content } = templateFn(template.data)
	createNotificationSrvc({ user, template, screen, title, content, kind, priority, media })
	if (privateSio) {
		privateSio.to(`${USER_NOTIFICATION_ROOM_PREFIX}${user.slug}`).emit('new_notification', { template, title, content, screen, media, priority })
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
			messages.push({
				to: s.expoPushToken,
				sound: 'default',
				title: title[user.settings.language.content] || title['en'],
				body: content[user.settings.language.content] || content['en'],
				data: { ...template.data, screen }, // Custom data for your frontend to handle
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
	try {
		return await updateOneNotificationRepo({ match, newData })
	} catch (err) {
		errorHandler({ err })
	}
}

export const createNotificationSrvc = async ({ user, template, screen, title, content, kind, priority, media }) => {
	log({ level: 'info', label: 'notifications', message: 'createNotificationSrvc', data: { user, template, screen, title, content, kind, priority, media } })
	const createdNotification = await createNotificationRepo({ user, template, screen, title, content, kind, priority, media })
	return createdNotification
}
