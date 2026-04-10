import { log } from '../log/index.js'
import config from '../../config/index.js'
import { Server } from 'socket.io'

// 1. Export a placeholder that will hold the IO instance
export let io = null

export const socketio = (server) => {
	// 2. Assign the instance to the exported variable
	io = new Server(server, config.socketio.options)

	io.on('connection', (socket) => {
		log({
			level: 'info',
			message: `socketId=${socket.id} connected`
		})

		// Capture slug from connection query
		const userSlug = socket.handshake.query?.user?.slug
		if (userSlug) {
			socket.join(userSlug)
			log({ level: 'info', message: `User ${userSlug} joined room.` })
		}

		socket.on('disconnect', (reason) => {
			log({ level: 'warn', message: reason })
		})
	})
	return io
}
