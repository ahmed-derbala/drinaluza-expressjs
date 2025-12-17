import { log } from '../log/index.js'
import config from '../../config/index.js'
import { Server } from 'socket.io'
import { batchRequire } from '../utils/loaders.js'

export const socketio = () => {
	const io = new Server(config.socketio.options)
	batchRequire({ fileSuffix: '.socketio.js', rootDir: '/components', params: io })

	io.on('error', (error) => {
		log({ level: 'error', message: error })
	})
	io.on('disconnect', (reason) => {
		log({ level: 'warn', message: reason })
	})
	io.on('connection', (socket) => {
		socket.emit('hi', 'ee')

		log({
			level: 'info',
			message: `socketId=${socket.id} connected | ip=${socket.handshake.address} | userAgent=${socket.handshake.headers['user-agent']}`
		})
		socket.broadcast.emit('welcome', { message: `${socket.id} joined` })
		socket.on('hi', (msg) => {
			console.log('hi event received:', msg)
			socket.to(msg.to).emit('hi', msg.data)
			socket.emit('hi', { data: { message: msg.data } })
		})
	})

	io.on('hi', (msg) => {
		console.log('hi event received:', msg)
		socket.to(msg.to).emit('hi', msg.data)
		socket.emit('hi', { data: { message: msg.data } })
	})
	io.listen(config.socketio.port)
}
