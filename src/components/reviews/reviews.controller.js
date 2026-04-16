import express from 'express'
import { findReviewsSrvc, createReviewSrvc } from './reviews.service.js'
import { resp } from '../../core/helpers/resp.js'
import { errorHandler } from '../../core/error/index.js'
import { authenticate } from '../../core/auth/index.js'
import { validate } from '../../core/validation/index.js'
import { createReviewVld } from './reviews.validator.js'
import { shopsCollection } from '../shops/shops.constants.js'
import mongoose from 'mongoose'
import { patchRatingShopSrvc } from '../shops/shops.service.js'
import { findOneShopSrvc } from '../shops/shops.service.js'
import { usersCollection } from '../users/users.constant.js'
import { findOneUserSrvc } from '../users/users.service.js'
import { productsCollection } from '../products/products.schema.js'
import { findOneProductSrvc } from '../products/products.service.js'
import { patchRatingProductSrvc } from '../products/products.service.js'

const router = express.Router()

router
	.route('/:targetResource/:targetId')
	.get(async (req, res) => {
		try {
			let { page = 1, limit = 10 } = req.query
			const reviews = await findReviewsSrvc({ match: { targetResource: req.params.targetResource, targetId: req.params.targetId }, page, limit })
			return resp({ status: 200, data: reviews, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(authenticate({ tokenRequired: false }), validate(createReviewVld), async (req, res) => {
		try {
			const { targetResource, targetId } = req.params
			const { stars, comment } = req.body
			let author = null,
				resource = null
			if (req.user) author = req.user
			//fetch resource
			switch (targetResource) {
				case shopsCollection:
					resource = await findOneShopSrvc({ match: { _id: targetId }, select: 'rating' })
					await patchRatingShopSrvc({ shopId: targetId, stars, rating: resource.rating })
					break
				case usersCollection:
					resource = await findOneUserSrvc({ match: { _id: targetId }, select: 'rating' })
					break
				case productsCollection:
					resource = await findOneProductSrvc({ match: { _id: targetId }, select: 'rating' })
					await patchRatingProductSrvc({ productId: targetId, stars, rating: resource.rating })
					break
				default:
					return errorHandler({ err: new Error('Invalid target resource'), req, res })
			}
			const review = await createReviewSrvc({ targetResource, targetId, stars, comment, author })
			return resp({ status: 201, data: review, req, res })
		} catch (err) {
			return errorHandler({ err, req, res })
		}
	})

export default router
