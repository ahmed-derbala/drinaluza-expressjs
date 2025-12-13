import jwt from 'jsonwebtoken'
import { SessionsModel } from './sessions.schema.js'
import { errorHandler } from '../error/index.js'
import config from '../../config/index.js'
import { resp } from '../helpers/resp.js'
import { log } from '../log/index.js'

export const authenticate = (params) => {
	return function (req, res, next) {
		try {
			//check params
			if (params == null) params = {}
			if (params.tokenRequired == null) params.tokenRequired = true
			if (params.role == null) params.role = null
			//search for token
			let token = checkStringForContent(req.headers.token)
			if (token == null) {
				if (req.cookies.token != null) token = req.cookies.token
				else if (req.headers['x-access-token'] != null) token = req.headers['x-access-token']
				else if (req.headers['authorization'] != null) token = req.headers['authorization']
				else if (req.query.token != null) token = req.query.token
			}
			if (token == null && params.tokenRequired == true) {
				if (config.NODE_ENV === 'production') return res.status(401).json({ message: 'Please signin' })
				return resp({ message: 'No token found on headers, cookies or query', status: 401, data: null, req, res })
			}
			token = token?.replace('Bearer ', '')
			//verify token
			return jwt.verify(token, config.auth.jwt.privateKey, async (err, decoded) => {
				if (err) {
					//if token is not required move on
					if (params.tokenRequired == false) {
						return next()
					}
					return errorHandler({ err, req, res, next })
				}
				//check if token is in session
				const session = await SessionsModel.findOne({ token: token }).select('token').lean()
				if (session == null) {
					return resp({ message: 'No session created with provided token', data: null, status: 401, req, res })
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

				// Check role-based access if role is specified
				if (params.role && req.user.role !== params.role) {
					return resp({
						message: `Access denied for user ${req.user.slug}. Required role: ${params.role}, user role: ${req.user.role || 'none'}`,
						status: 403,
						data: null,
						req,
						res
					})
				}

				return next()
			})
		} catch (err) {
			errorHandler({ err, req, res })
		}
	}
}
export const createNewSession = ({ user, req }) => {
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

/**
 * Checks if a string contains any non-whitespace characters.
 * @param {string} inputString - The string to check.
 * @returns {string|null} The original string if it contains content, otherwise null.
 */
function checkStringForContent(inputString) {
	// Use .trim() to remove leading and trailing whitespace.
	// Then, check if the resulting string is empty.
	if (inputString && inputString.trim() === '') {
		return null
	}

	// If the trimmed string is not empty, return the original string.
	return inputString
}
