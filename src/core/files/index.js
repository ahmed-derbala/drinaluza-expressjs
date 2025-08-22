import multer from 'multer'
import path from 'path'

// 1. Configure storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// Specify the directory where files will be stored
		// Make sure this directory exists!
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		// Generate a unique filename to prevent overwriting
		// You might want to use something more robust than originalname,
		// e.g., a UUID or a timestamp + original name
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
})

// 2. Initialize Multer with the storage configuration
export const fileUpload = multer({ storage: storage })
