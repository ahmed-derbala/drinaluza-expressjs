import * as expressValidator from 'express-validator'
const { body } = expressValidator

export const uploadFilesVld = [
	body('files').custom((value, { req }) => {
		if (!req.files || req.files.length === 0) {
			throw new Error('Files are required')
		}

		return true
	})
]
