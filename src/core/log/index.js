/**
 * this file has the logging system
 * logging system written in seperate file to make it easy to integrates in other projects and to be extensible as possible
 */
const config = require(`../../config`)
const { winstonLogger } = require('./winston.logger')
const { simplelogger } = require('./simple.logger')

/**
 * log function
 * @param {Object} log
 * @param {Request} log.req
 * @param {string} log.level
 * @param {string} log.message
 */
let log = (module.exports.log = ({ level, label, error, message, req, data }) => {
	switch (config.log.kind) {
		case 'winston':
			winstonLogger({ level, label, error, message, req, data })
			break

		case 'simple':
			simplelogger({ level, label, error, message, req, data })
			break
	}
})
