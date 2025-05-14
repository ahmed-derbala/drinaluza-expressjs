#!/usr/bin/env node
'use strict'
console.clear()
const { log } = require(`./core/log`)
const config = require('./config')

/**
 * connect dbs
 */
if (config.db.mongodb.isActive) {
	const { connectMongodb } = require('./core/db')
	connectMongodb()
}

process.on('warning', (err) => log({ message: err.stack, level: 'warn', label: 'process' })) //print out memory leak errors
process.on('uncaughtException', (err) => log({ message: err.stack, level: 'warn', label: 'process' }))
process.on('unhandledRejection', (err) => log({ message: err.stack, level: 'warn', label: 'process' }))

const server = require('./core/utils/server')
const { socketio } = require('./core/socketio')
socketio({ server })
