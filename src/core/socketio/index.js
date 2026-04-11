import { log } from '../log/index.js'
import config from '../../config/index.js'

// 1. Export a placeholder that will hold the IO instance
let io = null // Private variable
export const initSocketio = async (server) => {
	const { Server } = await import('socket.io')
	// 2. Assign the instance to the exported variable
	io = new Server(server, config.socketio.options)
	io.on('connection', (socket) => {
		log({ level: 'info', label: 'socketio', message: `socketId=${socket.id} connected | ${io.engine.clientsCount} clients` })

		// Capture slug from connection query
		const userSlug = socket.handshake.query.userSlug
		if (userSlug) {
			socket.join(userSlug)
			//console.log("Current Rooms:", io.sockets.adapter.rooms.keys());
			log({ level: 'info', message: `user ${userSlug} joined its room | ${socket.id}` })
		}
		socket.on('disconnect', (reason) => {
			log({ level: 'warn', message: reason })
		})
	})
	return io
}

export const getIO = () => {
	if (!io) {
		throw new Error('Socket.io not initialized!')
	}
	return io
}
