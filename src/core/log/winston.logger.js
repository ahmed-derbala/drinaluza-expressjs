// winston.logger.js
import * as winston from 'winston'
import { config } from '#config'

let wlogger = null

function getLogger() {
	if (!wlogger) {
		winston.addColors(config.log.levels.colors)
		wlogger = winston.createLogger(config.log.winston.createLoggerOptions)
	}
	return wlogger
}

export const winstonLogger = (logObject) => {
	if (!logObject.message) logObject.message = 'no_message'
	const logger = getLogger()
	logger[logObject.level](logObject)
}
