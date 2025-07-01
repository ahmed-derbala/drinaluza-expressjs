import { log } from '../log/index.js'
import config from '../../config/index.js'
import { Server } from 'socket.io'
import { batchRequire } from '../utils/loaders.js'
const socketio = ({ server }) => {
	let io = new Server(server, config.socketio.options)
	batchRequire({ fileSuffix: '.socketio.js', rootDir: '/components', params: io })
	io.on('error', (error) => {
		log({ level: 'error', message: error })
	})
	io.on('disconnect', (reason) => {
		log({ level: 'warn', message: reason })
	})
	io.on('connection', (socket) => {
		log({
			level: 'info',
			message: `socketId=${socket.id} | ip=${socket.handshake.address} | userAgent=${socket.handshake.headers['user-agent']}`
		})
		socket.broadcast.emit('welcome', { message: `${socket.id} joined` })
	})
}
export { socketio }
export default {
	socketio
}
