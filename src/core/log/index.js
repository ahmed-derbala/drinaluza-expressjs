import config from '../../config/index.js'
import { winstonLogger } from './winston.logger.js'
import { simplelogger } from './simple.logger.js'
import { removeEmptyKeys } from '../helpers/removeEmptyKeys.js'
import { sanitizeReq } from './sanitize-req.js'

/**
 * log function
 * @param {Object} log
 * @param {Request} log.req
 * @param {string} log.level
 * @param {string} log.message
 */
// Helper to check if a value is genuinely empty
const isEmpty = (value) => value === undefined || value === null || value === '' || Number.isNaN(value) || (typeof value === 'object' && Object.keys(value).length === 0)

let log = ({ level, status, label, error, message, req, data, user }) => {
	let rawLogLine = { level, status, label, error, message, req, data, user }
	rawLogLine.user = user ? user : null
	rawLogLine.status = status ? status : null
	level = level ? level : 'debug'
	if (!config.log.isActive || !config.log.levels.allowed.includes(level)) return null
	if (config.log.levels.isActive) rawLogLine.level = level
	if (config.log.label.isActive) rawLogLine.label = label ? label : null
	if (config.log.error.isActive) rawLogLine.error = error ? error : null
	if (config.log.data.isActive) rawLogLine.data = data ? data : null
	rawLogLine.message = message ? message : 'no_message'
	if (config.log.req.isActive) {
		if (message === config.log.reqDefaultLog) {
			rawLogLine.req = req ? req : null //morgan format, see morgan.tokenString in config
		} else {
			rawLogLine.req = req ? sanitizeReq(req) : null
		}
	}
	if (config.log.memory.isActive) rawLogLine.memory = parseFloat((process.memoryUsage.rss() / config.log.memory.unit).toFixed(3))
	if (config.log.caller.isActive) {
		const stack = new Error().stack
		let caller = null
		if (stack) {
			caller = stack.split('\n')[2].trim()
		}
		rawLogLine.caller = caller
	}

	//const logLine = removeEmptyKeys(rawLogLine)//removes empty nested objects too
	let logLine = Object.fromEntries(Object.entries(rawLogLine).filter(([_, value]) => !isEmpty(value)))
	//console.log(rawLogLine, 'rawLogLine')
	//console.log(logLine, 'logLine')
	switch (config.log.kind) {
		case 'winston':
			winstonLogger(logLine)
			break
		case 'simple':
			simplelogger(logLine)
			break
	}
}

export { log }
