const { objectIdValidator } = require('../../core/validation')
const { checkSchema, body, query, oneOf } = require('express-validator')

module.exports.createOrderVld = [
	body('products').isArray({ min: 1 }).withMessage('must be array with at least 1 product'),
	body('products.*._id').isMongoId().withMessage('Each item must have a valid MongoDB ObjectId in _id field')
]
