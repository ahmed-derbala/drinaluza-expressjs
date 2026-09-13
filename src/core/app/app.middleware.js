import { config } from '#config'
import { log } from '#log'
import { sanitizeReq, sanitizeRes } from '#helpers'

export const formatReqRes = () => {
	return (req, res, next) => {
		const startTime = Date.now()
		const originalSend = res.send
		let responseBody

		// Intercept the outgoing response body
		res.send = function (body) {
			responseBody = body
			return originalSend.apply(res, arguments)
		}

		// Intercept response finish event
		res.on('finish', () => {
			const responseTime = Date.now() - startTime

			let level = 'debug'
			if (res.statusCode >= 200 && res.statusCode < 300) level = 'verbose'
			if (res.statusCode >= 400 && res.statusCode < 500) level = 'warn'
			if (res.statusCode >= 500 && res.statusCode < 600) level = 'error'

			log({ level, label: 'req_res', request: sanitizeReq(req), response: sanitizeRes(res, responseTime, responseBody) })
		})

		next() // Pass control to the next route
	}
}
