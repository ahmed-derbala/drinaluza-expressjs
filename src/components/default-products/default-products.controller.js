import express from 'express'
import { resp } from '../../core/helpers/resp.js'
import { findManyDefaultProductsSrvc, createDefaultProductSrvc } from './default-products.service.js'
import { errorHandler } from '../../core/error/index.js'
const router = express.Router()
import { validate } from '../../core/validation/index.js'
import { createDefaultProductVld } from './default-products.validator.js'
import { authenticate } from '../../core/auth/index.js'
import config from '../../config/index.js'

router
	.route('/')
	.get(async (req, res) => {
		try {
			const { match, select } = req.body || {}
			let { page = 1, limit = 10 } = req.query
			const fetchedManyDefaultProducts = await findManyDefaultProductsSrvc({ page, limit })
			return resp({ status: 200, data: fetchedManyDefaultProducts, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
	.post(authenticate(), validate(createDefaultProductVld), async (req, res) => {
		try {
			const { name, searchKeywords } = req.body
			let { images } = req.body
			if (!images) {
				images = {}
				if (!images.thumbnail) {
					images.thumbnail = {}
					if (!images.thumbnail.url) {
						images.thumbnail.url = `${config.backend.url}/public/default-products/${name.en}/thumbnail.jpeg`
					}
				}
			}
			console.log(images)
			const createdDefaultProduct = await createDefaultProductSrvc({ name, images, searchKeywords })
			return resp({ status: 201, data: createdDefaultProduct, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	})
export default router
