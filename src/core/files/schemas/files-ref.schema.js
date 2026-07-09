import mongoose from 'mongoose'
import { filesCollection } from '../files.constant.js'

export const FileRefSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: filesCollection,
		required: false // needs to be true after testing
	},
	name: { type: String, required: false }, // name without extension
	extension: { type: String, required: false }, // the extension prefixed with a dot
	url: { type: String, required: true }, //download or display file
	encoding: { type: String, required: false },
	mimetype: String,
	size: Number, // in bytes, 1 million ~ 1 mb
	updatedAt: { type: Date, required: false },
	createdAt: { type: Date, required: false }
})
