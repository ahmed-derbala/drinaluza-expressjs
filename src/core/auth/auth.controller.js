const express = require('express')
const router = express.Router()
const config = require(`../../config`)
const { validate } = require('../../core/validation')
const { signinVld, signupVld } = require('./auth.validator')
const { authenticate, createNewSession } = require(`./index`)
const { errorHandler } = require('../error')
const { pickOneFilter } = require('../helpers/filters')
const { signinSrvc } = require('./auth.service')
const { resp } = require('../../core/helpers/resp')
const { findOneUserSrvc, createUserSrvc } = require('../../components/users/users.service')
const { createAuthSrvc } = require('./auth.service')

router.post('/signup', validate(signupVld), async (req, res) => {
	const { username, password } = req.body
	const existedUser = await findOneUserSrvc({ match: { username }, select: '_id' })
	if (existedUser) {
		return resp({ status: 409, message: 'user already exist', data: null, req, res })
	}

	const user = await createUserSrvc({ username })
	if (!user) return resp({ status: 400, data: null, message: 'no user was created', req, res })
	//console.log(user)
	const createdAuth = await createAuthSrvc({ user, password })
	const token = createNewSession({ user, req })

	return resp({ status: 200, data: { user, token }, req, res })
})

router.post('/signin', validate(signinVld), async (req, res) => {
	try {
		const { email, username, phone, password } = req.body
		const filter = pickOneFilter({ filters: { email, username, phone } })
		const authData = await signinSrvc({ match: { user: { username } }, password })
		console.log(authData)
		if (!authData) return resp({ status: 400, data: null, message: `no user found with ${filter}`, req, res })

		const token = createNewSession({ user: authData.user, req })
		return resp({ status: 200, data: { user: authData.user, token }, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.post('/signout', authenticate(), async (req, res) => {
	return Sessions.deleteOne({ token: req.headers.token })
		.then((deletedSession) => {
			return res.status(200).json({ message: 'singedout', data: deletedSession })
		})
		.catch((err) => errorHandler({ err, res }))
})

module.exports = router
