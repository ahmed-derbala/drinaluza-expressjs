const express = require('express')
const router = express.Router()
const usersSrvc = require(`./users.service`)
const { authenticate,  } = require(`../../core/auth`)
const { errorHandler } = require('../../core/utils/error')
const { log } = require('../../core/log')
const { resp } = require('../../core/helpers/resp')
const { validate } = require('../../core/validation')
const { findOneUserSrvc,  } = require('./users.service')

router.get('/:username', authenticate(), async (req, res) => {
	const { username } = req.params
	const user = await findOneUserSrvc({ match: { username } })
	if (!user) return resp({ status: 202, message: 'user not found', data: null, req, res })
	return resp({ status: 200, message: 'user found', data: user, req, res })
})

router.get('/profile', authenticate(), async (req, res) => {
	try {
		const profile = await usersSrvc.getProfile({ loginId: req.query.loginId, userId: req.user._id, req })
		return resp({ status: 200, data: profile, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})


module.exports = router
