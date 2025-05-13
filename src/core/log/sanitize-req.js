const config = require(`../../config`)
const { removeEmptyKeys } = require('../helpers/removeEmptyKeys')

let sanitizeReq = (module.exports.sanitizeReq = (req) => {
	let result = {
		status: req.status,
		method: req.method,
		originalUrl: req.originalUrl,
		user: req.user,
		body: req.body,
		ip: req.ip
	}
	if (!config.log.req.headers.isActive) return result

	let headers = {}
	if (config.log.req.headers.token.isActive) headers.token = req.headers.token
	if (config.log.req.headers.tid.isActive) headers.tid = req.headers.tid

	result.headers = headers
	result = removeEmptyKeys(result)
	return result
})
