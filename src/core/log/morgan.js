const morgan = require('morgan')
const config = require(`../../config`)
const { log } = require(`.`)
const _ = require('lodash')
const { errorHandler } = require('../utils/error')
const { removeEmptyKeys } = require('../helpers/removeEmptyKeys')

morgan.token('user', (req) => {
	if (!req.user) return '{}'
	return JSON.stringify(req.user)
})

morgan.token('browser', (req) => {
	return req.useragent.browser
})

morgan.token('os', (req) => {
	return req.useragent.os
})

morgan.token('platform', (req) => {
	return req.useragent.platform
})

morgan.token('isBot', (req) => {
	return req.useragent.isBot
})

morgan.token('referrer', (req) => {
	return req.headers.referrer || req.headers.referer
})

morgan.token('body', (req) => {
	if (!req.body) req.body = {}

	for (let [key, value] of Object.entries(req.body)) {
		if (config.log.morgan.hiddenBodyFields.includes(key)) req.body[key] = '***'
		if (req.body[key] != null) {
			for (let [k, v] of Object.entries(req.body[key])) {
				if (config.log.morgan.hiddenBodyFields.includes(`${key}.${k}`)) req.body[key][k] = '***'
			}
		}
	}
	return JSON.stringify(req.body)
})

morgan.token('nl', (req) => {
	return '\n' //new line
})

morgan.token('origin', (req) => {
	return req.headers.origin
})

morgan.token('ip', (req) => {
	return req.ip
})

morgan.token('originalUrl', (req) => {
	return req.originalUrl
})

morgan.token('headers', (req) => {
	if (!config.log.req.headers.isActive) return '{}'
	let headers = {}
	if (config.log.req.headers.token.isActive) headers.token = req.headers.token
	if (config.log.req.headers.tid.isActive) headers.tid = req.headers.tid

	return JSON.stringify(headers)
})

const stream = {
	write: function (req) {
		try {
			req = JSON.parse(req)
		} catch (e) {
			return errorHandler({ err: 'REQ_NOT_PARSED', req })
		}

		if (req.responseTime > config.app.responseTimeAlert) {
			log({ level: 'warn', label: 'request-timeout', req, message: `request took more than ${config.app.responseTimeAlert}ms` })
		}

		if (req.status == 422) return

		let level = 'error'
		if (_.inRange(req.status, 200, 399)) level = 'verbose'
		if (_.inRange(req.status, 400, 499)) level = 'warn'

		if (level != 'error') log({ req, level, message: config.log.reqDefaultLog }) //we only need to log non error requests cause they will be logged in errorHandler
	}
}

let morganLogger = () => {
	return morgan(config.log.morgan.tokenString, { stream })
}
module.exports = morganLogger
