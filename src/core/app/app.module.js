import express from 'express'
import cookieParser from 'cookie-parser'
import { express as useragent } from 'express-useragent'
import expressWinston from 'express-winston'
import winston from 'winston'
import { loadController } from './app.helper.js'
import { config } from '#config'
import compression from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import { errorHandler } from '../error/index.js'
import { log } from '#log'
import { pickKeysFromObject, tidHandler, resp } from '#helpers'
import { formatReqRes } from './app.middleware.js'

export let app = express()
app.set('trust proxy', 1) // Tell Express to trust the proxy header
if (config.node.env !== 'production' && config.security.delay.isEnabled) {
	log({ level: 'warn', message: `Delay middleware is active. All requests will be delayed by ${config.security.delay.ms} ms.` })
	// Delay middleware factory
	const delay = (ms) => (req, res, next) => setTimeout(next, ms)
	// Apply to ALL routes (e.g., 2000 ms / 2 seconds)
	app.use(delay(config.security.delay.ms))
}
//make the public folder accessible at /public
app.use('/public', express.static(`${process.cwd()}/public`))
app.use(cors(config.app.corsOptions))
app.use(config.security.apiLimiter)
app.use(compression())
if (config.security.helmet.isEnabled) app.use(helmet(config.security.helmet.options))
app.use(tidHandler)
app.use(useragent())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.disable('x-powered-by')
app.disable('etag')
app.use(formatReqRes())

//save logs to db
app.use(
	expressWinston.logger({
		transports: [new winston.transports.MongoDB(config.log.winston.transportsOptions.mongo)],
		expressFormat: true
	})
)

await loadController({ app, rootDir: '/features', urlPrefix: '/api/', fileSuffix: '.controller.js' }) //load api
await loadController({ app, rootDir: '/features/index', urlPrefix: '/', fileSuffix: '.controller.js', hasSubDir: false }) //load "/"
await loadController({ app, rootDir: '/features/businesses/restaurants', urlPrefix: '/api/', fileSuffix: '.controller.js', hasSubDir: false })
await loadController({ app, rootDir: '/core/auth', urlPrefix: '/api/', fileSuffix: '.controller.js', hasSubDir: false }) //load auth
await loadController({ app, rootDir: '/core/health', urlPrefix: '/', fileSuffix: '.controller.js', hasSubDir: false })
await loadController({ app, rootDir: '/core/notifications', urlPrefix: '/api/', fileSuffix: '.controller.js', hasSubDir: false })
await loadController({ app, rootDir: '/core/sessions', urlPrefix: '/api/', fileSuffix: '.controller.js', hasSubDir: false })
await loadController({ app, rootDir: '/core/files', urlPrefix: '/api/', fileSuffix: '.controller.js', hasSubDir: false })

//when no api route matched
app.use((req, res, next) => {
	let { method, originalUrl } = req
	return resp({
		status: 404,
		label: 'route_not_found',
		message: `${method} ${originalUrl} does not exist`,
		req,
		res
	})
})

/**
 * must be the last middleware to catch errors
 * if res.headersSent is true, it means that the response has already been sent to the client, and we cannot send another response. In this case, we call next(err) to delegate to the default Express error handler, which will close the connection.
 * if res.headersSent is false, it means that the response has not been sent yet, and we can safely call our custom errorHandler middleware to handle the error and send a response to the client.
 * This approach ensures that we do not attempt to send multiple responses for the same request, which would result in an error.
 * Note: The errorHandler middleware should be designed to handle errors gracefully and send appropriate responses to the client based on the error type and status code.
 * This is a common pattern in Express applications to ensure that errors are handled consistently and that clients receive meaningful error responses.
 *
 */
app.use((err, req, res, next) => {
	console.error('express error catcher', err)
	if (res.headersSent) {
		return next(err) // Avoid sending response if one was already sent. Delegates to default Express error handler to close connection
	}
	return res.status(err.status || 500).json(err)
})
//export default app
