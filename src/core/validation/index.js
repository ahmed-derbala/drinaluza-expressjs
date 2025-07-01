import * as expressValidator from 'express-validator'
import { errorHandler } from '../error/index.js'
import mongoose from 'mongoose'
const { validationResult } = expressValidator
export const validate = (validator) => {
	return async (req, res, next) => {
		await Promise.all(validator.map((schema) => schema.run(req)))
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return errorHandler({ err: errors, req, res })
		}
		return next()
	}
}
