#!/usr/bin/env node
'use strict'
console.clear()
const fs = require('fs')
const { log } = require(`./core/log`)

const defaultConfigFilePath = `${process.cwd()}/src/config/index.js`
if (!fs.existsSync(defaultConfigFilePath)) {
	log({ level: 'error', message: `${defaultConfigFilePath} is required.` })
	if (process.env.NODE_ENV) {
		const envConfigFilePath = `${process.cwd()}/src/config/${process.env.NODE_ENV}.config.js`
		if (fs.existsSync(envConfigFilePath)) {
			log({ level: 'debug', message: `${envConfigFilePath} is optionnal.` })
		}
	}
	process.exit(1)
}

const config = require('./config')

/**
 * connect dbs
 */
if (config.db.mongodb.isActive) {
	const { connectMongodb } = require('./core/db')
	connectMongodb()
}

//process.on('warning', (err) => log({ message: err.stack, level: 'warn' })) //print out memory leak errors
//process.on('uncaughtException', (err) => log({ message: err.stack, level: 'warn' }))
//process.on('unhandledRejection', (err) => log({ message: err.stack, level: 'warn' }))

const server = require('./core/utils/server')
const { socketio } = require('./core/socketio')
socketio({ server })
