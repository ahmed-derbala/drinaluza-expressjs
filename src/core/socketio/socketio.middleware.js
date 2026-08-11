import jwt from 'jsonwebtoken'
import config from '#config'
import { findOneSessionSrvc } from '#core/sessions/sessions.service.js'
import { log } from '#core/log/index.js'

export const authenticateSocketio = () => {
	return async (socket, next) => {
		try {
			const token = socket.handshake.auth?.token
			if (!token) {
				return next(new Error('unauthorized: no token provided'))
			}

			jwt.verify(token, config.auth.jwt.privateKey, async (err, decoded) => {
				if (err) {
					return next(new Error('unauthorized: invalid token'))
				}

				const session = await findOneSessionSrvc({ match: { token } })
				if (session == null) {
					return next(new Error('unauthorized: no session found for token'))
				}

				if (decoded.user == null) {
					return next(new Error('unauthorized: token has no valid user object'))
				}

				socket.user = decoded.user
				return next()
			})
		} catch (err) {
			log({ level: 'error', label: 'authenticateSocket', message: 'Socket authentication error', error: err })
			return next(new Error('unauthorized'))
		}
	}
}
