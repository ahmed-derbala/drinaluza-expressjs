import * as winston from 'winston'
import config from '../../config/index.js'
winston.addColors(config.log.levels.colors)
const wlogger = winston.createLogger(config.log.winston.createLoggerOptions)

//export const winstonLogger = ({ level, status, label, error, message, req, data, user }) => {
export const winstonLogger = (logObject) => {
	wlogger[logObject.level](logObject)
}
