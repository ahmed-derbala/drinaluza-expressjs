const winston = require('winston')
const config = require(`../../config`)
const { removeEmptyKeys } = require('../helpers/removeEmptyKeys')
const { sanitizeReq } = require('./sanitize-req')

winston.addColors(config.log.levels.colors)
const logger = winston.createLogger(config.log.createLoggerOptions)

const winstonLogger = ({ level, label, error, message, req, data }) => {
	let logObject = {}
	level = level ? level : 'debug'
	if (!config.log.isActive || !config.log.levels.allowed.includes(level)) return null

	if (config.log.levels.isActive) logObject.level = level
	if (config.log.label.isActive) logObject.label = label ? label : null
	if (config.log.error.isActive) logObject.error = error ? error : null
	if (config.log.data.isActive) logObject.data = data ? data : null

	logObject.message = message ? message : 'no_message'
	if (config.log.req.isActive) {
		if (message === config.log.reqDefaultLog) {
			logObject.req = req ? req : null //morgan format, see morgan.tokenString in config
		} else {
			logObject.req = req ? sanitizeReq(req) : null
		}
	}
	if (config.log.memory.isActive) logObject.memory = parseFloat((process.memoryUsage.rss() / config.log.memory.unit).toFixed(3))
	if (config.log.caller.isActive) {
		const stack = new Error().stack
		let caller = null
		if (stack) {
			caller = stack.split('\n')[2].trim()
		}
		logObject.caller = caller
	}
	logObject = removeEmptyKeys(logObject)

	logger[level](logObject)
}
module.exports = { winstonLogger }
