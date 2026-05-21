import express from 'express'
import { errorHandler, authenticate, resp } from '#core'
import { findMyBusinessesSrvc } from '#businesses/businesses.service.js'
import { findOneDashboard } from './dashboard.service.js'
const router = express.Router()

router.route('/').get(authenticate(), async (req, res) => {
	try {
		let dashboard = null
		if (req.user.role == 'business_owner') dashboard = await findOneDashboard({ match: { 'user.slug': req.user.slug, kind: 'business' } })
		if (!dashboard) dashboard = await findOneDashboard({ match: { 'user.slug': req.user.slug, kind: 'personal' } })
		return resp({ status: 200, data: dashboard, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/profiles').get(authenticate(), async (req, res) => {
	try {
		let profiles = []
		let personal = { ...req.user, kind: 'personal' }
		profiles.push(personal)

		if (req.user.role == 'business_owner') {
			let businesses = await findMyBusinessesSrvc({ match: { 'owner._id': req.user._id }, owner: req.user, select: '_id slug name media' })
			businesses = businesses.docs.map((bus) => ({ ...bus, kind: 'business' }))
			profiles.push(...businesses)
		}

		return resp({ status: 200, data: profiles, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/personal').get(authenticate(), async (req, res) => {
	try {
		let dashboard = await findOneDashboard({ match: { 'user._id': req.user._id, kind: 'personal' } })

		return resp({ status: 200, data: dashboard, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

router.route('/business/:businessSlug').get(authenticate(), async (req, res) => {
	try {
		let dashboard = await findOneDashboard({ match: { 'user._id': req.user._id, kind: 'business' } })
		return resp({ status: 200, data: dashboard, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

export default router
