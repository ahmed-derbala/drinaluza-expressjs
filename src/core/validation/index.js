const { validationResult } = require('express-validator')
const { errorHandler } = require('../error')
const mongoose = require('mongoose')

exports.validate = (validator) => {
	return async (req, res, next) => {
		await Promise.all(validator.map((schema) => schema.run(req)))
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return errorHandler({ err: errors, req, res })
		}
		return next()
	}
}
