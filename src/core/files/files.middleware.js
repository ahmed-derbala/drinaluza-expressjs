import multer from 'multer'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import config from '#config'
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_FILE_COUNT, MAX_FILE_SIZE } from './files.constant.js'
import { errorHandler } from '#core/error/index.js'
import { log } from '#core/log/index.js'

cloudinary.config(config.cloudinary)

const storage = {
	_handleFile(req, file, cb) {
		const isVideo = file.mimetype.startsWith('video/')
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: 'uploads',
				resource_type: 'auto',
				access_mode: 'public',
				...(isVideo && {
					// Incoming transformation: permanently modifies the file on disk (original is discarded)
					transformation: [
						{
							// Scale down max resolution
							width: 1920,
							height: 1080,
							crop: 'limit',
							// Format & Universal Expo Codec
							fetch_format: 'mp4',
							video_codec: 'h264',
							// Audio: retain audio, but compress with AAC for minimal size
							audio_codec: 'aac',
							audio_frequency: 22050, // Downsample audio sample rate to 22.05 kHz
							audio_bitrate: '64k',
							// Aggressive visual compression targeted for low-bandwidth streaming
							quality: 'auto:low'
						}
					]
				})
			},
			(error, cloudinaryData) => {
				if (error) {
					return cb(error)
				}
				log({ level: 'debug', label: '_handleFile', data: { multerData: file, cloudinaryData } })
				// Keep only the data your application needs
				delete file.fieldname
				delete file.encoding

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
				delete cloudinaryData.pages
				delete cloudinaryData.audio
				delete cloudinaryData.video
				delete cloudinaryData.is_audio
				delete cloudinaryData.frame_rate
				delete cloudinaryData.bit_rate
				delete cloudinaryData.rotation

				cb(null, {
					...file,
					...cloudinaryData
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
