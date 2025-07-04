import express from 'express'
import config from '../../config/index.js'
import { validate } from '../validation/index.js'
import { signinVld, signupVld } from './auth.validator.js'
import { authenticate, createNewSession } from './index.js'
import { errorHandler } from '../error/index.js'
import { pickOneFilter } from '../helpers/filters.js'
import { signinSrvc } from './auth.service.js'
import { resp } from '../helpers/resp.js'
import { findOneUserSrvc, createUserSrvc } from '../../components/users/users.service.js'
import { createAuthSrvc } from './auth.service.js'
import { SessionsModel } from './sessions.schema.js'
const router = express.Router()
router.post('/signup', validate(signupVld), async (req, res) => {
	const { username, password } = req.body
	let { settings } = req.body
	const existedUser = await findOneUserSrvc({ match: { username }, select: '_id' })
	if (existedUser) {
		return resp({ status: 409, message: 'user already exist', data: null, req, res })
	}
	if (!settings) settings = { lang: config.users.defaults.settings.lang, currency: config.users.defaults.settings.currency }
	const user = await createUserSrvc({ username, settings })
	if (!user) return resp({ status: 400, data: null, message: 'no user was created', req, res })
	const createdAuth = await createAuthSrvc({ user, password })
	const token = createNewSession({ user, req })
	return resp({ status: 200, data: { user, token }, req, res })
})
router.post('/signin', validate(signinVld), async (req, res) => {
	try {
		const { email, username, phone, password } = req.body
		const filter = pickOneFilter({ filters: { email, username, phone } })
		const authData = await signinSrvc({ match: { user: { username } }, password })
		//console.log(authData)
		if (!authData) return resp({ status: 400, data: null, message: `no user found with ${filter}`, req, res })
		const token = createNewSession({ user: authData.user, req })
		return resp({ status: 200, data: { user: authData.user, token }, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
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
