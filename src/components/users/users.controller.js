import express from 'express'
import * as usersSrvc from './users.service.js'
import { authenticate } from '../../core/auth/index.js'
import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import { resp } from '../../core/helpers/resp.js'
import { validate } from '../../core/validation/index.js'
import { findOneUserSrvc } from './users.service.js'
const router = express.Router()
router.get('/:username', async (req, res) => {
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
export default router
