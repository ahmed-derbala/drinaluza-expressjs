import mongoose from 'mongoose'
import { config } from '#config'
import { log } from '#log'
import { errorHandler } from '#error'

// Register listeners once at top-level scope
mongoose.connection
	.on('error', (err) => {
		log({
			message: `mongodb-connection-error | ${config.db.mongodb.name} | ${config.db.mongodb.host}:${config.db.mongodb.port}`,
			level: 'error',
			label: 'mongodb',
			data: err
		})
	})
	.on('close', () => {
		log({ label: 'mongodb', message: 'mongodb-connection-close', level: config.log.levels.names.verbose })
	})
	.on('disconnected', () => {
		log({
			message: 'mongodb-connection-disconnected',
			level: config.log.levels.names.warn,
			label: 'mongodb'
		})
	})
	.on('reconnected', () => {
		log({
			message: 'mongodb-connection-reconnected',
			level: config.log.levels.names.verbose,
			label: 'mongodb'
		})
	})
	.on('fullsetup', () => {
		log({
			message: 'mongodb-connection-fullsetup',
			level: config.log.levels.names.verbose,
			label: 'mongodb'
		})
	})
	.on('all', () => {
		log({ message: 'mongodb-connection-all', level: config.log.levels.names.verbose, label: 'mongodb' })
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
			label: 'mongodb',
			data: config.db.mongodb
		})

		await mongoose.connect(config.db.mongodb.uri, config.db.mongodb.options)

		log({
			message: `mongodb-connection-success | ${config.db.mongodb.uri}`,
			level: 'debug',
			label: 'mongodb'
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
			label: 'mongodb'
		})

		await mongoose.disconnect()

		log({
			message: 'db-disc-success',
			level: 'debug',
			label: 'mongodb'
		})
	} catch (err) {
		errorHandler({ err })
		throw err
	}
}
