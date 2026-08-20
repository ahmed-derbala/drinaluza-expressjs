import { log } from '../log/index.js'
import { sanitizeReq } from '../log/sanitize-req.js'
import multer from 'multer'
const noLogStatuses = [401]

export const errorHandler = ({ err, req, res, next, error, status = 500, label = 'internal_error', message = error, level = 'error' }) => {
	err = err || error || errors || req?.error || message || 'Unknown error'
	let errObject = {}

	errObject.level = level ? level : 'error'
	errObject.status = err.status ? err.status : status
	if (typeof err == 'object') {
		if (err.errors) {
			errObject.error = err.errors
			errObject.status = 422
			errObject.message = 'validation error'
			errObject.level = 'warn'
			errObject.label = 'validation_error'
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
				errObject.status = 409
				errObject.label = 'validation_error_db'
			}
			if (['JsonWebTokenError', 'TokenExpiredError'].includes(err.name)) {
				errObject.status = 401
			}
			if (err.name == 'MulterError') {
				errObject.status = 422
				errObject.label = 'file_upload_error'
				errObject.message = err.message
				errObject.error = err
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

	const stack = new Error().stack
	if (stack) {
		errObject.caller = stack.split('\n')[2].trim()
	}
	if (req) {
		errObject.req = sanitizeReq(req)
	}
	if (!noLogStatuses.includes(status)) log(errObject)

	if (res) {
		return res.status(status).json(errObject)
	}

	throw errObject
}
