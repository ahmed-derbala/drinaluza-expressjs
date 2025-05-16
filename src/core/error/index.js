const { log } = require(`../log`)
const { sanitizeReq } = require('../log/sanitize-req')
const noLogStatuses = [401]

/**
 * handle errors
 * @param {Object} error
 * @param {Object | String} error.err the error message or object
 * @param {Request} error.req request object
 * @param {Response} error.res response object
 * @param {Next} error.next next object
 */
exports.errorHandler = ({ err, req, res, next }) => {
	let status = 500,
		errObject = {}
	if (err.status) status = err.status
	const stack = new Error().stack
	let caller = null
	if (stack) {
		caller = stack.split('\n')[2].trim()
	}
	errObject.caller = caller
	errObject.level = 'error'

	if (err) {
		if (typeof err == 'object') {
			if (err.errors) {
				errObject.error = err.errors
				status = 422
				errObject.message = 'validation error'
				errObject.level = 'warn'
			}
			if (err.message) {
				errObject.message = err.message
			}
			if (err.stack) {
				errObject.message = err.toString()
				errObject.error = err.stack
			}
			if (err.name) {
				if (err.name == 'ValidationError' || err.code == 11000) {
					status = 409
				}
				if (['JsonWebTokenError', 'TokenExpiredError'].includes(err.name)) {
					status = 401
				}
			}
		}

		if (typeof err == 'string') {
			errObject.message = err
			errObject.error = err
		}
	}

	errObject.status = status
	if (!errObject.message) errObject.message = 'error'

	if (req) {
		errObject.req = sanitizeReq(req)
	}
	if (!noLogStatuses.includes(status)) log(errObject)
	if (res) {
		return res.status(status).json(errObject)
	}
	return errObject
}

exports.ERROR_TYPES = {
	validation: {
		code: 409,
		name: 'validation error',
		message: 'validation error'
	}
}
