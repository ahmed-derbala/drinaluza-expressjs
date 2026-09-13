import { errorHandler } from '#error/error.module.js'

export const resp = ({ status, message, req, res, viewer = { canEdit: false, canCreate: false, canDelete: false }, data }) => {
	if (!res) return errorHandler({ label: 'res_object_null', req, res, err: 'res is required' })

	if (typeof status === 'number') {
		status = {
			code: status,
			message
		}
	}
	if (data) {
		delete data.password //just for safety
		if (data.user) delete data.user.password //just for safety
		if (data.auth) delete data.auth.password
	}

	return res.status(status.code).json({
		status,
		tid: req.headers.tid,
		viewer,
		data
	})
}
