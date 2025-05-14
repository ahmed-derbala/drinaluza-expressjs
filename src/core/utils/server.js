const config = require(`../../config`)
const { log } = require(`../log`)

/**
 * Module dependencies.
 */
const app = require('./app')
const http = require('http')

/**
 * Get port from environment
 */
app.set('port', config.backend.port)

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
if (config.app.cluster > 0) {
	let cluster = require('cluster')
	if (cluster.isMaster) {
		log({
			message: `cluster is enabled. ${config.app.cluster} cpus are in use`,
			level: 'info',
			label: 'server'
		})
		// Create a worker for each CPU
		for (let c = 1; c <= config.app.cluster; c++) {
			cluster.fork()
		}

		// Listen for dying workers
		cluster.on('exit', function () {
			console.log(`cluster exited`)
			cluster.fork()
		})
	} else {
		//launching the server
		server.listen(
			config.backend.port,
			log({
				message: `${config.app.name} ${config.app.version} ${config.backend.url} NODE_ENV=${config.NODE_ENV} fork ${cluster.worker.id} pid ${cluster.worker.process.pid}`,
				level: 'info',
				label: 'server'
			})
		)
		server.on('error', onError)
		server.on('listening', onListening)
	}
} else {
	//launching the server without cluster
	server.listen(
		config.backend.port,
		log({
			message: `${config.app.name} ${config.app.version} ${config.backend.url} NODE_ENV=${config.NODE_ENV}`,
			level: 'info',
			label: 'server'
		})
	)
	server.on('error', onError)
	server.on('listening', onListening)
}

server.setTimeout(0) //make sure timeout is disabled , wait forever

process.on('SIGINT', () => {
	log({ level: 'error', message: 'Received SIGINT signal. Gracefully shutting down...', label: 'server' })
	// Close server connections
	server.close(() => {
		log({ level: 'error', message: 'Server closed. Exiting...', label: 'server' })
		process.exit(0)
	})
})

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error
	}

	const bind = typeof config.backend.port === 'string' ? 'Pipe ' + config.backend.port : 'Port ' + config.backend.port

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			log({ level: 'error', message: `${bind} requires elevated privileges`, label: 'server' })
			process.exit(1)
			break
		case 'EADDRINUSE':
			log({
				level: 'error',
				message: `${bind} is already in use. If you used pm2, try npm run delete`,
				label: 'server'
			})
			process.exit(1)
			break
		default:
			throw error
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address()
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
}

module.exports = server
