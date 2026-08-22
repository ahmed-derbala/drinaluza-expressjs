import multer from 'multer'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import config from '#config'
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_FILE_COUNT, MAX_FILE_SIZE } from './files.constant.js'
import { errorHandler } from '#core/error/index.js'

cloudinary.config(config.cloudinary)

const storage = multer.memoryStorage()

const multerUpload = multer({
	limits: {
		fileSize: MAX_FILE_SIZE
	},
	storage,
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

const uploadToCloudinary = (buffer, options = {}) => {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				folder: 'uploads',
				resource_type: 'auto',
				access_mode: 'public',
				...options
			},
			(error, result) => {
				if (error) {
					return reject(error)
				}

				resolve(result)
			}
		)

		stream.end(buffer)
	})
}

const cloudinaryUploadMW = async (req, res, next) => {
	try {
		const fields = ['thumbnail', 'gallery']

		for (const field of fields) {
			if (!req.files?.[field]) continue

			req.files[field] = await Promise.all(
				req.files[field].map(async (multerData) => {
					const cloudinaryData = await uploadToCloudinary(multerData.buffer)
					delete multerData.buffer // not used anymore, waste of req size
					delete multerData.encoding
					delete multerData.fieldname
					delete cloudinaryData.bytes
					delete cloudinaryData.public_id
					delete cloudinaryData.version
					delete cloudinaryData.version_id
					delete cloudinaryData.signature
					delete cloudinaryData.created_at
					delete cloudinaryData.tags
					delete cloudinaryData.bytes
					delete cloudinaryData.type
					delete cloudinaryData.etag
					delete cloudinaryData.placeholder
					delete cloudinaryData.display_name
					delete cloudinaryData.original_filename
					delete cloudinaryData.api_key

					return {
						...multerData,
						...cloudinaryData
					}
				})
			)
		}

		next()
	} catch (err) {
		next(err)
	}
}

export const uploadMW = [
	multerUpload.fields([
		{ name: 'thumbnail', maxCount: 1 },
		{ name: 'gallery', maxCount: MAX_FILE_COUNT }
	]),
	cloudinaryUploadMW
]
