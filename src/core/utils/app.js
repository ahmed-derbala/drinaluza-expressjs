/* eslint-disable no-undef */
import express from 'express'
import cookieParser from 'cookie-parser'
import useragent from 'express-useragent'
import expressWinston from 'express-winston'
import winston from 'winston'
import * as loaders from './loaders.js'
import morganLogger from '../log/morgan.js'
import rateLimit from 'express-rate-limit'
import config from '../../config/index.js'
import compression from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import { tidHandler } from '../helpers/tid.js'
import { errorHandler } from '../error/index.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from '../swagger/swagger.js'
import { resp } from '../helpers/resp.js'
import expressLayouts from 'express-ejs-layouts'
let app = express()
app.use(cors(config.app.corsOptions))
app.use('/', rateLimit(config.app.apiLimiter))
app.use(compression())
if (config.app.helmet.isActive) app.use(helmet(config.app.helmet.options))
app.use(tidHandler)
app.use(useragent.express())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.disable('x-powered-by')
app.disable('etag')
app.use(morganLogger())
//save logs to db
app.use(
	expressWinston.logger({
		transports: [new winston.transports.MongoDB(config.log.winston.transportsOptions.mongo)],
		expressFormat: true
	})
)
app.use(config.app.swagger.endpoint, swaggerUi.serve, swaggerUi.setup(swaggerSpec.mainDef))
if (config.app.views) {
	app.use(expressLayouts)
	app.set('layout', './index/views/layout', { author: 'app' })
	app.set('views', `${process.cwd()}/src/components`)
	app.set('view engine', 'ejs')
	app.use(express.static(`public`))
	loaders.load({ app, rootDir: '/components', urlPrefix: '/', fileSuffix: '.render.js' }) //load views
}
loaders.load({ app, rootDir: '/components', urlPrefix: '/api/', fileSuffix: '.controller.js' }) //load api
loaders.load({ app, rootDir: '/components/index', urlPrefix: '/', fileSuffix: '.controller.js', hasSubDir: false }) //load "/"
loaders.load({ app, rootDir: '/core/auth', urlPrefix: '/api/', fileSuffix: '.controller.js', hasSubDir: false }) //load auth
//when no api route matched
app.use((req, res, next) => {
	return resp({ status: 404, label: 'route_not_found', message: `${req.method} ${req.originalUrl} does not exist`, data: null, req, res })
})
//when error occurs
app.use((err, req, res, next) => {
	if (res.headersSent) {
		return next(err) // Avoid sending response if one was already sent
	}
	return errorHandler({ err, req, res })
})
export default app
