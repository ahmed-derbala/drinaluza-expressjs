import { config } from '#config'
import { pickKeysFromObject } from './pickKeysFromObject.js'

export const sanitizeReq = (req) => {
	if (!config.log.request.isEnabled) return
	let request = pickKeysFromObject(req, ['method', 'originalUrl', 'ip', 'body'])
	if (request.method == 'GET') delete request.body
	if (config.log.request.headers.isEnabled) request.headers = pickKeysFromObject(req.headers, ['token', 'origin', 'referer', 'tid'])
	if (config.log.request.useragent.isEnabled)
		request.useragent = pickKeysFromObject(req.useragent, ['isMobile', 'isMobileNative', 'isTablet', 'isiPad', 'isiPhone', 'isAndroid', 'isBot', 'browser', 'version', 'os', 'platform', 'geoIp'])
	if (config.log.request.user.isEnabled && req.user) {
		request.user = req.user
		delete request.user.name
	}
	return request
}

export const sanitizeRes = (res, responseTime, responseBody) => {
	if (!config.log.response.isEnabled) return
	let response = {}
	response = {
		//statusCode: res.statusCode,
		//statusMessage: res.statusMessage,
		responseTimeMs: responseTime
	}
	// Safely parse body if it was sent as a JSON string
	let parsedResponseBody = responseBody
	try {
		if (typeof responseBody === 'string') {
			parsedResponseBody = JSON.parse(responseBody)
		}
	} catch (e) {
		// Retain raw string if it's plain text or HTML
	}
	if (config.log.response.body.isEnabled) response.body = parsedResponseBody
	if (!config.log.response.body.data.isEnabled) delete response.body.data

	return response
}
