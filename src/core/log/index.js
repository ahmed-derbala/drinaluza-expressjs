import config from '../../config/index.js'
import { winstonLogger } from './winston.logger.js'
import { simplelogger } from './simple.logger.js'
/**
 * log function
 * @param {Object} log
 * @param {Request} log.req
 * @param {string} log.level
 * @param {string} log.message
 */
let log = ({ level, label, error, message, req, data }) => {
	switch (config.log.kind) {
		case 'winston':
			winstonLogger({ level, label, error, message, req, data })
			break
		case 'simple':
			simplelogger({ level, label, error, message, req, data })
			break
	}
}
export { log }
