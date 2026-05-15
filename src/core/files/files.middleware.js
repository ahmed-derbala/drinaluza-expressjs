import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import config from '#config'
import path from 'path'
import { fileURLToPath } from 'url'
import { ALLOWED_EXTENSIONS } from './files.constant.js'
import { v2 as cloudinary } from 'cloudinary'
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
	storage,
	fileFilter: (req, file, cb) => {
		const fileType = req.query.fileType

		if (!fileType) {
			return cb(new Error('fileType query is required'))
		}

		const allowedExtensions = ALLOWED_EXTENSIONS[fileType]

		if (!allowedExtensions) {
			return cb(new Error('Invalid fileType'))
		}

		const ext = path.extname(file.originalname).toLowerCase()

		if (!allowedExtensions.includes(ext)) {
			return cb(new Error(`Only ${allowedExtensions.join(', ')} files are allowed`))
		}
		cb(null, true)
	}
}).array('files', 5)
