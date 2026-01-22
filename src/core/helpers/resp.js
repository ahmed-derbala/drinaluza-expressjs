import { log } from '../log/index.js'
import { errorHandler } from '../error/index.js'
import { inRange } from './randoms.js'

export const resp = ({ level, status, label, message, req, data, pagination, res }) => {
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
	log({
		level,
		label,
		message,
		data,
		req: {
			status,
			method: req.method,
			originalUrl: req.originalUrl,
			user: req.user,
			ip: req.ip,
			body: req.body,
			headers: { tid: req.headers.tid }
		}
	})
	return res.status(status).json({ level, status, label, message, pagination, data, req: { /*user: req.user,*/ headers: { tid: req.headers.tid } } })
}
