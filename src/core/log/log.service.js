import { config } from '#config'
import { winstonLogger } from './winston.logger.js'
import { simplelogger } from './simple.logger.js'
import { removeEmptyKeys, pickKeysFromObject } from '#helpers'

/**
 * log function
 * @param {Object} log
 * @param {Request} log.req
 * @param {string} log.level
 * @param {string} log.message
 */
// Helper to check if a value is genuinely empty
const isEmpty = (value) => value === undefined || value === null || value === '' || Number.isNaN(value) || (typeof value === 'object' && Object.keys(value).length === 0)

export const log = ({ level, label, error, message, request, response, data, user }) => {
	let rawLogLine = { level, label, error, message, request, response, data, user }
	rawLogLine.user = user ? user : null
	level = level ? level : 'debug'
	if (!config.log.isActive || !config.log.levels.allowed.includes(level)) return null
	if (config.log.levels.isActive) rawLogLine.level = level
	if (config.log.label.isActive) rawLogLine.label = label ? label : null
	if (config.log.error.isActive) rawLogLine.error = error ? error : null
	if (config.log.data.isActive) rawLogLine.data = data ? data : null
	if (config.log.request.isActive) {
		if (message === config.log.reqDefaultLog) {
			rawLogLine.request = request ? request : null
		} else {
			rawLogLine.request = request ? sanitizeReq(request) : null
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

export const sanitizeReq = (request) => {
	//console.log(req, 'req')
	let result = {
		status: request.status,
		method: request.method,
		originalUrl: request.originalUrl,
		user: request.user,
		body: request.body,
		ip: request.ip
	}
	if (!config.log.request.headers.isActive) return result
	let headers = {}

	if (config.log.request.headers.token.isActive) headers.token = req.headers.token
	if (config.log.request.headers.tid.isActive) headers.tid = request.headers.tid
	result.headers = headers
	result = removeEmptyKeys(result)
	return result
}

export const formatReqRes = () => {
	return (req, res, next) => {
		let logLine = {}
		//console.log(req)
		const startTime = Date.now()
		const originalSend = res.send
		let responseBody

		// Intercept the outgoing response body
		res.send = function (body) {
			responseBody = body
			return originalSend.apply(res, arguments)
		}

		// Capture incoming request data
		let request = {
			method: req.method,
			originalUrl: req.originalUrl,
			ip: req.ip,
			user: req.user,
			body: req.body
		}

		// Intercept response finish event
		res.on('finish', () => {
			if (config.log.request.headers.isEnabled) request.headers = pickKeysFromObject(req.headers, ['token', 'origin', 'referer', 'tid'])
			if (config.log.request.useragent.isEnabled)
				request.useragent = pickKeysFromObject(req.useragent, ['isMobile', 'isMobileNative', 'isTablet', 'isiPad', 'isiPhone', 'isAndroid', 'isBot', 'browser', 'version', 'os', 'platform', 'geoIp'])
			if (config.log.request.user.isEnabled) {
				delete req.user.name
				request.user = req.user
			}

			const responseTime = Date.now() - startTime
			// Safely parse body if it was sent as a JSON string
			let parsedResponseBody = responseBody
			try {
				if (typeof responseBody === 'string') {
					parsedResponseBody = JSON.parse(responseBody)
				}
			} catch (e) {
				// Retain raw string if it's plain text or HTML
			}

			let response = {}
			if (config.log.response.isEnabled)
				logLine.response = {
					//statusCode: res.statusCode,
					//statusMessage: res.statusMessage,
					responseTimeMs: responseTime
				}
			if (config.log.response.body.isEnabled) logLine.response.body = parsedResponseBody
			if (!config.log.response.body.data.isEnabled) delete logLine.response.body.data

			let level = 'debug'
			if (res.statusCode >= 200 && res.statusCode < 300) level = 'verbose'
			if (res.statusCode >= 400 && res.statusCode < 500) level = 'warn'
			if (res.statusCode >= 500 && res.statusCode < 600) level = 'error'

			logLine.timestamp = startTime
			logLine.level = level
			logLine.label = 'req_res'
			if (config.log.request.isEnabled) logLine.request = request
			log(logLine)
		})

		next() // Pass control to the next route
	}
}
