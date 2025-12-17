import { log } from '../log/index.js'
import { sanitizeReq } from '../log/sanitize-req.js'
const noLogStatuses = [401]

export const errorHandler = ({ err, req, res, next, error }) => {
	if (!err && error) err = error
	let status = 500,
		errObject = {},
		label = 'internal_error'
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
				label = 'validation_error'
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
					label = 'validation_error_db'
				}
				if (['JsonWebTokenError', 'TokenExpiredError'].includes(err.name)) {
					status = 401
				}
			}
			if (err.error) {
				errObject.error = err.error
			}
		}
		if (typeof err == 'string') {
			errObject.message = err
			errObject.error = err
		}
	}
	errObject.status = status
	errObject.label = label
	//console.error(errObject.error);

	if (!errObject.message) errObject.message = 'error'
	if (req) {
		errObject.req = sanitizeReq(req)
	}
	if (!noLogStatuses.includes(status)) log(errObject)
	if (res) {
		return res.status(status).json(errObject)
	}
	throw errObject
}
