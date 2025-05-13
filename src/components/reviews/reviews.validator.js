const { objectIdValidator } = require('../../core/validation')
const { body, query } = require('express-validator')

module.exports.patchRatingVld = [body('currentValue').notEmpty().isNumeric(), body('reputationId').custom(objectIdValidator)]

module.exports.createReviewVld = [
	//body('story').isObject(),
	//body('story.text').notEmpty(),
	//body('story.lang').notEmpty(),
	body('value').isNumeric(),
	body('identityId').custom(objectIdValidator)
]
