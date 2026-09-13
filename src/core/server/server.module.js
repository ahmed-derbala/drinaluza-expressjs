import { config } from '#config'
import { log } from '#log'
import { app } from '#app'
import http from 'http'
import cluster from 'cluster'
import { initSocketio } from '../socketio/index.js'

app.set('port', config.backend.port)
const logData = { app: config.app, node: config.node, backend: config.backend }

const server = http.createServer(app)
initSocketio(server)

server.setTimeout(0) // Disable timeout

// Handle server errors and listening events
server.on('error', onError)
server.on('listening', onListening)

// Graceful shutdown handling
process.once('SIGINT', () => {
	log({ level: 'info', message: 'Received SIGINT signal. Gracefully shutting down...', label: 'server' })
	server.close(() => {
		log({ level: 'info', message: 'Server closed. Exiting...', label: 'server' })
		process.exit(0)
	})
})

/**
 * Start function explicitly called from main.js AFTER DB connects
 */
export const startServer = () => {
	const isPrimary = cluster.isPrimary ?? cluster.isMaster // Fallback for older Node versions

	if (config.app.cluster > 0) {
		if (isPrimary) {
			log({
				message: `Cluster enabled. Forking ${config.app.cluster} workers...`,
				level: 'debug',
				label: 'server'
			})
			for (let c = 1; c <= config.app.cluster; c++) {
				cluster.fork()
			}
			cluster.on('exit', (worker, code, signal) => {
				log({
					message: `Worker ${worker.process.pid} exited with code ${code}. Forking new worker...`,
					level: 'warn',
					label: 'server'
				})
				cluster.fork()
			})
		} else {
			// Worker process listens on port
			listenServer(`fork ${cluster.worker.id} pid ${cluster.worker.process.pid}`)
		}
	} else {
		// Single process mode
		listenServer('standalone')
	}
}

function listenServer(mode) {
	server.listen(config.backend.port, () => {
		log({
			message: `${config.app.name} ${config.app.version} [${mode}]`,
			level: 'debug',
			label: 'server',
			data: logData
		})
	})
}

function onError(error) {
	if (error.syscall !== 'listen') throw error
	const bind = typeof config.backend.port === 'string' ? 'Pipe ' + config.backend.port : 'Port ' + config.backend.port
	switch (error.code) {
		case 'EACCES':
			log({ level: 'error', message: `${bind} requires elevated privileges`, label: 'server' })
			process.exit(1)
			break
		case 'EADDRINUSE':
			log({ level: 'error', message: `${bind} is already in use`, label: 'server' })
			process.exit(1)
			break
		default:
			throw error
	}
}

function onListening() {
	const addr = server.address()
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
	log({ level: 'info', message: `Server bound to ${bind}`, label: 'server' })
}
