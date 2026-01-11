import express from 'express'
import config from '../../config/index.js'
import { validate } from '../validation/index.js'
import { signinVld, signupVld } from './auth.validator.js'
import { authenticate, createNewSession } from './index.js'
import { errorHandler } from '../error/index.js'
import { resp } from '../helpers/resp.js'
import { findOneUserSrvc, createUserSrvc } from '../../components/users/users.service.js'
import { createAuthSrvc, findOneAuthSrvc } from './auth.service.js'
import { SessionsModel } from './sessions.schema.js'
import { log } from '../log/index.js'
import bcrypt from 'bcrypt'

const router = express.Router()

router.post('/signup', validate(signupVld), async (req, res) => {
	const { slug, password, role } = req.body
	let { settings, address = {}, socialMedia = {} } = req.body
	const existedUser = await findOneUserSrvc({ match: { slug }, select: '_id' })
	if (existedUser) {
		return resp({ status: 409, message: 'user already exist', data: null, req, res })
	}
	if (!settings) settings = config.defaults.users.settings

	const user = await createUserSrvc({ slug, role, settings, address, socialMedia })
	if (!user) return resp({ status: 400, data: null, message: 'no user was created', req, res })
	await createAuthSrvc({ user, password })
	const token = createNewSession({ user, req })
	return resp({ status: 200, data: { user, token }, req, res })
})

router.post('/signin', validate(signinVld), async (req, res) => {
	try {
		const { slug, password } = req.body
		const fecthedAuth = await findOneAuthSrvc({ match: { slug }, select: '+password' })
		if (!fecthedAuth) {
			return resp({ status: 404, data: null, message: `no user found with slug=${slug}`, req, res })
		}
		const passwordCompare = bcrypt.compareSync(password, fecthedAuth.password)
		if (passwordCompare == false) {
			if (config.NODE_ENV === 'production') return resp({ status: 409, message: 'loginId or password is not correct', data: null, req, res })
			return resp({ status: 409, message: 'password incorrect', data: null, req, res })
		}
		const token = createNewSession({ user: fecthedAuth.user, req })
		return resp({ status: 200, data: { user: fecthedAuth.user, token }, req, res })
	} catch (err) {
		return errorHandler({ err, req, res })
	}
})

router.post('/signout', authenticate(), async (req, res) => {
	return SessionsModel.deleteOne({ token: req.headers.token })
		.then((deletedSession) => {
			return res.status(200).json({ message: 'singedout', data: deletedSession })
		})
		.catch((err) => errorHandler({ err, res }))
})
export default router
