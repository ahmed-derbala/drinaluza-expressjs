import { log } from './core/log/index.js'
import config from './config/index.js'
import { connectMongodb } from './core/db/index.js'
import server from './core/utils/server.js'
import { socketio } from './core/socketio/index.js'
;('use strict')
console.clear()
/**
 * connect dbs
 */
if (config.db.mongodb.isActive) {
	connectMongodb()
}
process.on('warning', (err) => log({ message: err.stack, level: 'warn', label: 'process' })) //print out memory leak errors
process.on('uncaughtException', (err) => log({ message: err.stack, level: 'warn', label: 'process' }))
process.on('unhandledRejection', (err) => log({ message: err.stack, level: 'warn', label: 'process' }))
socketio({ server })
