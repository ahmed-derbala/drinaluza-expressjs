import mongoose from 'mongoose'
import { filesCollection } from '../files.constant.js'

export const FileRefSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: filesCollection,
		required: false //make it required after testing
	},
	originalname: { type: String, required: false }, // name + . + extension, make it required after testing
	url: { type: String, required: true }, //download or display file
	mimetype: String,
	size: Number, // in bytes, 1 million ~ 1 mb
	updatedAt: { type: Date, required: false },
	createdAt: { type: Date, required: false }
})
