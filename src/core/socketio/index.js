import { authenticateSocketio } from './socketio.middleware.js'
import { log } from '#core/log/index.js'
import config from '#config'
import { USER_NOTIFICATION_ROOM_PREFIX } from './socketio.constant.js'
// 1. Export a placeholder that will hold the IO instance
let io = null
let publicNs = null
let privateNs = null

export const initSocketio = async (server) => {
	const { Server } = await import('socket.io')
	io = new Server(server, config.socketio.options)

	publicNs = io.of('/public')
	publicNs.on('connection', (socket) => {
		const publicClients = publicNs.sockets.size
		log({ level: 'info', label: 'socketio_public_connection', message: `socketId=${socket.id} connected | publicClients=${publicClients}` })

		socket.on('disconnect', (reason) => {
			log({ level: 'warn', label: 'socketio_public_disconnect', message: `socketId=${socket.id} | ${reason} | publicClients=${publicClients}` })
		})
		socket.on('error', (error) => {
			log({ level: 'error', label: 'socketio_public_error', message: `socketId=${socket.id} | ${error} | publicClients=${publicClients}` })
		})
	})

	privateNs = io.of('/private')
	privateNs.use(authenticateSocketio())
	privateNs.on('connection', (socket) => {
		// const clients = io.engine.clientsCount
		const privateClients = privateNs.sockets.size
		const connSlug = socket.user.slug
		const room = `${USER_NOTIFICATION_ROOM_PREFIX}${connSlug}`
		socket.join(room)
		log({ level: 'info', label: 'socketio_private_connection', message: `socketId=${socket.id} joined room=${room} | privateClients=${privateClients}` })
		socket.on('disconnect', (reason) => {
			log({ level: 'warn', label: 'socketio_private_disconnect', message: `socketId=${socket.id} | ${reason} | privateClients=${privateClients}` })
		})
		socket.on('error', (error) => {
			log({ level: 'error', label: 'socketio_private_error', message: `socketId=${socket.id} | ${error} | privateClients=${privateClients}` })
		})
	})

	return io
}

export const getPublicSocketio = () => {
	if (!publicNs) throw new Error('Socket.io not initialized!')
	return { publicNs, clientsCount: publicNs.sockets.size }
}

export const getPrivateSocketio = () => {
	if (!privateNs) throw new Error('Socket.io not initialized!')
	return { privateNs, clientsCount: privateNs.sockets.size }
}

export const getSocketio = () => {
	if (!io) {
		throw new Error('Socket.io not initialized!')
	}
	return io
}
