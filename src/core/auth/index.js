const jwt = require('jsonwebtoken')
const { SessionsModel } = require(`./sessions.schema`)
const { errorHandler } = require('../utils/error')
const config = require(`../../config`)
const { resp } = require('../helpers/resp')

exports.authenticate = (params) => {
	return function (req, res, next) {
		try {
			//check params
			if (params == null) params = {}
			if (params.tokenRequired == null) params.tokenRequired = true
			//search for token
			if (req.headers.token == null) {
				if (req.cookies.token != null) req.headers.token = req.cookies.token
				else if (req.headers['x-access-token'] != null) req.headers.token = req.headers['x-access-token']
				else if (req.headers['authorization'] != null) req.headers.token = req.headers['authorization']
				else if (req.query.token != null) req.headers.token = req.query.token
			}

			if (req.headers.token == null && params.tokenRequired == true) {
				if (config.NODE_ENV === 'production') return res.status(403).json({ message: 'Please signin' })
				return resp({ message: 'No token found on headers, cookies or query', status: 403, data: null, req, res })
			}
			req.headers.token = req.headers.token.replace('Bearer ', '')

			//verify token
			return jwt.verify(req.headers.token, config.auth.jwt.privateKey, async (err, decoded) => {
				if (err) {
					//if token is not required move on
					if (params.tokenRequired == false) {
						return next()
					}
					return errorHandler({ err, req, res, next })
				}
				//check if token is in session
				const session = await SessionsModel.findOne({ token: req.headers.token }).select('token').lean()
				if (session == null) {
					return resp({ message: 'No session created with provided token', data: null, status: 403, req, res })
				}
				//console.log(decoded, 'decoded');
				//check if we have valid user object
				if (decoded.user == null) {
					return resp({
						message: `token has no valid user object`,
						data: decoded,
						status: 401,
						req,
						res
					})
				}
				if (req.headers['user-agent'] !== decoded.req.headers['user-agent']) {
					let data = null
					if (config.NODE_ENV !== 'production') data = { reqUserAgent: req.headers['user-agent'], decodedUserAgent: decoded.req.headers['user-agent'] }
					return resp({ message: `token must be used in one device`, status: 401, data, req, res })
				}
				req.user = decoded.user
				return next()
			})
		} catch (err) {
			errorHandler({ err, req, res })
		}
	}
}

exports.createNewSession = ({ user, req }) => {
	const token = jwt.sign({ user, req: { ip: req.ip, headers: { 'user-agent': req.headers['user-agent'] } } }, config.auth.jwt.privateKey, { expiresIn: config.auth.jwt.expiresIn })

	SessionsModel.create({
		token,
		user,
		req: {
			headers: req.headers,
			ip: req.ip
		}
	})

	return token
}
