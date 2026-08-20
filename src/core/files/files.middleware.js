import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import config from '#config'
import path from 'path'
import { fileURLToPath } from 'url'
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_FILE_COUNT, MAX_FILE_SIZE } from './files.constant.js'
import { v2 as cloudinary } from 'cloudinary'
import { errorHandler } from '#core/error/index.js'
cloudinary.config(config.cloudinary)

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'uploads',
		allowed_formats: ALLOWED_EXTENSIONS,
		resource_type: 'auto',
		access_mode: 'public'
	}
})

export const uploadMW = multer({
	limits: { fileSize: MAX_FILE_SIZE },
	storage,
	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname).slice(1).toLowerCase()

		if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
			return cb(null, true)
		}
		cb(errorHandler({ err: `file is not allowed`, status: 422, level: 'warn', req }), false)
	}
}).fields([
	{ name: 'thumbnail', maxCount: 1 },
	{ name: 'gallery', maxCount: MAX_FILE_COUNT }
])
