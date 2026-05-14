import express from 'express'
import { authenticate, errorHandler, resp, validate } from '#core'
import { createFilesSrvc } from './files.service.js'
import { uploadMW } from './files.middleware.js'
import config from '#config'
import { uploadFilesVld } from './files.validator.js'

const router = express.Router()

router.route('/upload').post(
	authenticate(),
	uploadMW,
	/*  (req, res, next) => {
              // We wrap Multer to handle its errors gracefully
              uploadMW(req, res, (err) => {
                  if (err instanceof multer.MulterError) {
                      return res.status(400).json({ message: "Multer error", error: err.message });
                  } else if (err) {
                      return res.status(400).json({ message: "Validation error", error: err.message });
                  }
                  next();
              });
          },*/
	async (req, res) => {
		try {
			console.log('filesController', req.files)
			// If it gets here, the file passed validation
			const files = await createFilesSrvc({ user: req.user, files: req.files })
			console.log('files', files)
			return resp({ status: 200, data: files, req, res })
		} catch (err) {
			errorHandler({ err, req, res })
		}
	}
)

export default router
