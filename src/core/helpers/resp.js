import { log } from '../log/index.js'
import { errorHandler } from '../error/index.js'
import { inRange } from './randoms.js'

export const resp = ({ level, status, label, message, req, data, res }) => {
	if (!res) return errorHandler({ label: 'res_object_null', req, res, err: 'res is required' })
	if (!level) {
		if (inRange(status, 200, 399)) level = 'verbose'
		if (inRange(status, 400, 499)) level = 'warn'
		if (inRange(status, 500, 599)) level = 'error'
	}
	if (data) {
		delete data.password //just for safety
		if (data.user) delete data.user.password //just for safety
		if (data.auth) delete data.auth.password
	}
	/*log({
		level,
		label,
		message
	})*/
	return res.status(status).json({
		level,
		status,
		label,
		message,
		data
		//req: {  headers: { tid: req.headers.tid } }
	})
}
