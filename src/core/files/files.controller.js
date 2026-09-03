import express from 'express'
import { authenticate } from '#auth'
import { errorHandler } from '#error'
import { resp } from '#helpers/resp.js'
import { validate } from '#validation'
import { createFilesSrvc } from './files.service.js'
import { uploadMW } from './files.middleware.js'
import config from '#config'
import { uploadFilesVld } from './files.validator.js'
import multer from 'multer'
import { FileModel } from './files.schema.js'
import { UserModel } from '#users/users.schema.js'
const router = express.Router()

router.route('/upload').post(
	authenticate(),
	uploadMW,
	/*(req, res, next) => {
			// We wrap Multer to handle its errors gracefully
			uploadMW(req, res, (err) => {
				if (err instanceof multer.MulterError) {
					return res.status(422).json({ message: "Multer error", error: err.message });
				} else if (err) {
					return res.status(422).json({ message: "Validation error", error: err.message });
				}
				next();
			});
		},*/
	validate(uploadFilesVld),
	async (req, res) => {
		try {
			// If it gets here, the file passed validation
			const files = await createFilesSrvc({ user: req.user, files: req.files, targetModelName: req.body.targetModelName, targetModelId: req.body.targetModelId })
			return resp({ status: 200, data: files.data, message: files.message, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	}
)

router.route('/:fileId').delete(async (req, res) => {
	try {
		return resp({ status: 200, data: null, message: `file deleted`, req, res })
	} catch (err) {
		errorHandler({ err, req, res })
	}
})

export default router
