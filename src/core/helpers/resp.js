const { errorHandler } = require('../../core/utils/error')

/**
 *
 * @param {*} param0
 * @returns
 */
exports.resp = ({ status, label, message, req, data, pagination, res }) => {
	if (!res) return errorHandler({ label: 'res_object_null', req, res, err: 'res is required' })
	return res.status(status).json({ status, label, message, pagination, data, req: { headers: { tid: req.headers.tid } } })
}
