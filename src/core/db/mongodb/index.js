const mongoose = require('mongoose')
const config = require(`../../../config`)
const { log } = require(`../../log`)
const { errorHandler } = require('../../error')

const connectMongodb = async () => {
	try {
		await mongoose.connect(config.db.mongodb.uri, config.db.mongodb.options)
		log({
			message: `db-conn-success | ${config.db.mongodb.name} | ${config.db.mongodb.host}:${config.db.mongodb.port}`,
			level: 'info',
			label: 'db-mongo'
		})
	} catch (err) {
		errorHandler({ err })
	}

	mongoose.connection
		.on('error', () => {
			log({
				message: `db-conn-error | ${config.db.mongodb.name} | ${config.db.mongodb.host}:${config.db.mongodb.port}`,
				level: 'error',
				label: 'db-mongo'
			})
		})
		.on('close', () => {
			log({ label: 'db-mongo', message: 'db-conn-close', level: config.log.levelNames.error })
		})
		.on('disconnected', () => {
			log({
				message: 'db-conn-disconnecting',
				level: config.log.levelNames.warn,
				label: 'db-mongo'
			})
		})
		.on('disconnected', () => {
			log({
				message: 'db-conn-disconnected',
				level: config.log.levelNames.error,
				label: 'db-mongo'
			})
		})
		.on('reconnected', () => {
			log({
				message: 'db-conn-reconnected',
				level: config.log.levelNames.verbose,
				label: 'db-mongo'
			})
		})
		.on('fullsetup', () => {
			log({
				message: 'db-conn-fullsetup',
				level: config.log.levelNames.verbose,
				label: 'db-mongo'
			})
		})
		.on('all', () => {
			log({ message: 'db-conn-all', level: config.log.levelNames.verbose, label: 'db-mongo' })
		})
}

module.exports = {
	connectMongodb
}
