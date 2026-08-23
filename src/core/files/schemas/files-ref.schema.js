import mongoose from 'mongoose'
import { filesCollection } from '../files.constant.js'

export const FileRefSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: filesCollection,
		required: false //make it required after testing
	},
	originalname: { type: String, required: false },
	size: { type: Number, required: false }, // in bytes, 1 million ~ 1 mb
	width: Number,
	height: Number,
	format: String, //extension without dot
	resource_type: { type: String, required: false }, //image, video
	url: { type: String, required: true }, //download or display file
	secure_url: { type: String, required: false }, //download or display file over https
	playback_url: { type: String, required: false }, //video url over https
	duration: Number
})
