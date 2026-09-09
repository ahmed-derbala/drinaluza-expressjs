import mongoose from 'mongoose'
import { config } from '#config'
import { log } from '#log'
import { errorHandler } from '#error'

// Register listeners once at top-level scope
mongoose.connection
	.on('error', (err) => {
		log({
			message: `db-conn-error | ${config.db.mongodb.name} | ${config.db.mongodb.host}:${config.db.mongodb.port}`,
			level: 'error',
			label: 'db-mongo',
			data: err
		})
	})
	.on('close', () => {
		log({ label: 'db-mongo', message: 'db-conn-close', level: config.log.levels.names.verbose })
	})
	.on('disconnected', () => {
		log({
			message: 'db-conn-disconnected',
			level: config.log.levels.names.warn,
			label: 'db-mongo'
		})
	})
	.on('reconnected', () => {
		log({
			message: 'db-conn-reconnected',
			level: config.log.levels.names.verbose,
			label: 'db-mongo'
		})
	})
	.on('fullsetup', () => {
		log({
			message: 'db-conn-fullsetup',
			level: config.log.levels.names.verbose,
			label: 'db-mongo'
		})
	})
	.on('all', () => {
		log({ message: 'db-conn-all', level: config.log.levels.names.verbose, label: 'db-mongo' })
	})

export const connectMongodb = async () => {
	// If already connected, return early
	if (mongoose.connection.readyState === 1) {
		return
	}

	try {
		log({
			message: `mongodb-connecting`,
			level: 'debug',
			label: 'db-mongo',
			data: config.db.mongodb
		})

		await mongoose.connect(config.db.mongodb.uri, config.db.mongodb.options)

		log({
			message: `db-conn-success | ${config.db.mongodb.uri}`,
			level: 'debug',
			label: 'db-mongo'
		})
	} catch (err) {
		errorHandler({ err })
		throw err
	}
}

export const disconnectMongodb = async () => {
	// If disconnected or disconnecting, return early
	if (mongoose.connection.readyState === 0) {
		return
	}

	try {
		log({
			message: 'mongodb-disconnecting',
			level: 'debug',
			label: 'db-mongo'
		})

		await mongoose.disconnect()

		log({
			message: 'db-disc-success',
			level: 'debug',
			label: 'db-mongo'
		})
	} catch (err) {
		errorHandler({ err })
		throw err
	}
}
