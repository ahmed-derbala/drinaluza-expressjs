const { checkSchema, body, query, oneOf } = require('express-validator')

module.exports.createOrderVld = [
	body('createdByUser').isMongoId().optional(),
	body('products').isArray({ min: 1 }).withMessage('must be array with at least 1 product'),
	body('products.*.product._id').isMongoId().withMessage('Each item must have a valid MongoDB ObjectId in _id field')
]
