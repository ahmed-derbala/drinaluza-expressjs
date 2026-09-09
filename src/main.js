import { log } from './core/log/index.js'
import { config } from '#config'
import { connectMongodb } from '#mongodb'
import { startHttpServer } from './core/utils/server.js'

;('use strict')

async function bootstrap() {
	try {
		// 1. Connect to MongoDB FIRST
		if (config.db.mongodb.isActive) {
			await connectMongodb()
		}

		// 2. Start HTTP Server & Cluster ONLY after DB connection is ready
		startHttpServer()
	} catch (err) {
		log({ message: `Fatal startup error: ${err.stack}`, level: 'error', label: 'process' })
		process.exit(1)
	}
}

process.on('warning', (err) => log({ message: err.stack, level: 'warn', label: 'process' }))
process.on('uncaughtException', (err) => log({ message: err.stack, level: 'error', label: 'process' }))
process.on('unhandledRejection', (err) => log({ message: err.stack, level: 'error', label: 'process' }))

bootstrap()
