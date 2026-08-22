import multer from 'multer'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import config from '#config'
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_FILE_COUNT, MAX_FILE_SIZE } from './files.constant.js'
import { errorHandler } from '#core/error/index.js'

cloudinary.config(config.cloudinary)

const storage = {
	_handleFile(req, file, cb) {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: 'uploads',
				resource_type: 'auto',
				access_mode: 'public'
			},
			(error, cloudinaryData) => {
				if (error) {
					return cb(error)
				}

				// Keep only the data your application needs
				delete cloudinaryData.bytes
				delete cloudinaryData.version
				delete cloudinaryData.version_id
				delete cloudinaryData.signature
				delete cloudinaryData.created_at
				delete cloudinaryData.tags
				delete cloudinaryData.type
				delete cloudinaryData.etag
				delete cloudinaryData.placeholder
				delete cloudinaryData.display_name
				delete cloudinaryData.original_filename
				delete cloudinaryData.api_key

				cb(null, {
					...cloudinaryData,
					originalname: file.originalname,
					mimetype: file.mimetype
				})
			}
		)

		file.stream.pipe(uploadStream)
	},

	_removeFile(req, file, cb) {
		cb(null)
	}
}

const multerUpload = multer({
	storage,

	limits: {
		fileSize: MAX_FILE_SIZE
	},

	fileFilter: (req, file, cb) => {
		const fileExtension = path.extname(file.originalname).slice(1).toLowerCase()

		if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(fileExtension)) {
			return cb(null, true)
		}

		cb(
			errorHandler({
				err: 'file is not allowed',
				status: 422,
				level: 'warn',
				req
			}),
			false
		)
	}
})

export const uploadMW = multerUpload.fields([
	{ name: 'thumbnail', maxCount: 1 },
	{ name: 'gallery', maxCount: MAX_FILE_COUNT }
])
