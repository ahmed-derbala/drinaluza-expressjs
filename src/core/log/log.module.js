import { config } from '#config'
import { winstonLogger } from './winston.logger.js'
import { simplelogger } from './simple.logger.js'

/**
 * log function
 * @param {Object} log
 * @param {Request} log.req
 * @param {string} log.level
 * @param {string} log.message
 */
// Helper to check if a value is genuinely empty
const isEmpty = (value) => value === undefined || value === null || value === '' || Number.isNaN(value) || (typeof value === 'object' && Object.keys(value).length === 0)

export const log = ({ level, label, error, message, request, response, data, user, caller }) => {
	let rawLogLine = { level, label, error, message, request, response, data, user }
	rawLogLine.user = user ? user : null
	level = level ? level : 'debug'
	if (!config.log.isEnabled || !config.log.levels.allowed.includes(level)) return null
	if (config.log.levels.isEnabled) rawLogLine.level = level
	if (config.log.label.isEnabled) rawLogLine.label = label ? label : null
	if (config.log.error.isEnabled) rawLogLine.error = error ? error : null
	if (config.log.data.isEnabled) rawLogLine.data = data ? data : null
	if (config.log.memory.isEnabled) rawLogLine.memory = parseFloat((process.memoryUsage.rss() / config.log.memory.unit).toFixed(3))
	if (config.log.caller.isEnabled) {
		if (!caller) {
			const stack = new Error().stack
			if (stack) {
				caller = stack.split('\n')[2].trim()
			}
		}
		rawLogLine.caller = caller
	}

	let logLine = Object.fromEntries(Object.entries(rawLogLine).filter(([_, value]) => !isEmpty(value)))
	switch (config.log.kind) {
		case 'winston':
			winstonLogger(logLine)
			break
		case 'simple':
			simplelogger(logLine)
			break
	}
}
