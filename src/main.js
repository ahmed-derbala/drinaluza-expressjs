import { log } from '#log'
import { connectMongodb } from '#mongodb'
import { startServer } from './core/server/server.module.js'

;('use strict')

async function bootstrap() {
	try {
		// 1. Connect to MongoDB FIRST
		await connectMongodb()

		// 2. Start HTTP Server & Cluster ONLY after DB connection is ready
		startServer()
	} catch (err) {
		log({ message: `Fatal startup error: ${err.stack}`, level: 'error', label: 'process' })
		process.exit(1)
	}
}

process.on('warning', (err) => log({ message: err.stack, level: 'warn', label: 'process' }))
process.on('uncaughtException', (err) => log({ message: err.stack, level: 'error', label: 'process' }))
process.on('unhandledRejection', (err) => log({ message: err.stack, level: 'error', label: 'process' }))

bootstrap()
