import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import config from '#config'
import path from 'path'
import { fileURLToPath } from 'url'
import { ALLOWED_EXTENSIONS_ALL, MAX_FILE_COUNT, MAX_FILE_SIZE } from './files.constant.js'
import { v2 as cloudinary } from 'cloudinary'
import { errorHandler } from '#core/error/index.js'
cloudinary.config(config.cloudinary)

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'uploads',
		allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'mp4', 'mov', 'avi'],
		resource_type: 'auto'
	}
})

export const uploadMW = multer({
	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname).toLowerCase()

		if (!ALLOWED_EXTENSIONS_ALL.includes(ext)) {
			return cb(errorHandler({ err: `${ext} extension is not allowed`, status: 422 }))
		}
		cb(null, true)
	},
	storage,
	limits: { fileSize: MAX_FILE_SIZE }
}).fields([
	{ name: 'thumnail', maxCount: 1 },
	{ name: 'gallery', maxCount: MAX_FILE_COUNT }
])
