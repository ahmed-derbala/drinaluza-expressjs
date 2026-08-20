import * as expressValidator from 'express-validator'
const { body, form } = expressValidator

export const uploadFilesVld = [
	body('files').custom((value, { req }) => {
		if (!req.files || Object.keys(req.files).length === 0) {
			throw new Error('req.files.thumbnail (single file) or req.files.gallery (multiple files) are required')
		}
		return true
	}),
	body('targetModelName').isString().notEmpty().withMessage('targetModelName is required'),
	body('targetModelId').isMongoId().notEmpty().withMessage('targetModelId is required')
]
