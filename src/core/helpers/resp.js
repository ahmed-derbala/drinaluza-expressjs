import { errorHandler } from '../error/index.js'
export const resp = ({ status, label, message, req, data, pagination, res }) => {
	if (!res) return errorHandler({ label: 'res_object_null', req, res, err: 'res is required' })
	if (data) {
		delete data.password //just for safety
		if (data.user) delete data.user.password //just for safety
		if (data.auth) delete data.auth.password //just for safety
	}
	return res.status(status).json({ status, label, message, pagination, data, req: { headers: { tid: req.headers.tid } } })
}
