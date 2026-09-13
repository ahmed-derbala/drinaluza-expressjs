import { authenticateSocketio } from './socketio.middleware.js'
import { log } from '#log'
import { config } from '#config'
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
		log({ level: 'info', label: 'socketio_public_connection', message: `socket connected`, data: { socketId: socket.id, publicClients: publicNs.sockets.size } })

		socket.on('disconnect', (reason) => {
			log({ level: 'warn', label: 'socketio_public_disconnect', message: `socket disconnected`, data: { socketId: socket.id, publicClients: publicNs.sockets.size, reason } })
		})

		socket.on('error', (error) => {
			log({ level: 'error', label: 'socketio_public_error', message: `socket error`, data: { socketId: socket.id, publicClients: publicNs.sockets.size, error }, error })
		})
	})

	privateNs = io.of('/private')
	privateNs.use(authenticateSocketio())
	privateNs.on('connection', (socket) => {
		// const clients = io.engine.clientsCount
		const connSlug = socket.user.slug
		const room = `${USER_NOTIFICATION_ROOM_PREFIX}${connSlug}`
		socket.join(room)

		log({ level: 'info', label: 'socketio_private_connection', message: `socket joined room`, data: { socketId: socket.id, privateClients: privateNs.sockets.size, room } })

		socket.on('disconnect', (reason) => {
			log({ level: 'warn', label: 'socketio_private_disconnect', message: `socket disconnected`, data: { socketId: socket.id, privateClients: privateNs.sockets.size, reason } })
		})

		socket.on('error', (error) => {
			log({ level: 'error', label: 'socketio_private_error', message: `socket error`, data: { socketId: socket.id, privateClients: privateNs.sockets.size, error }, error })
		})
	})

	return io
}

export const getPublicSocket = () => {
	if (!publicNs) throw new Error('Socket.io not initialized!')
	return { io: publicNs, clientsCount: publicNs.sockets.size }
}

export const getPrivateSocket = () => {
	if (!privateNs) throw new Error('Socket.io not initialized!')
	return { io: privateNs, clientsCount: privateNs.sockets.size }
}

export const getSocket = () => {
	if (!io) {
		throw new Error('Socket.io not initialized!')
	}
	return { io, clientsCount: io.engine.clientsCount }
}
