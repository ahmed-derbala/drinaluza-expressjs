import mongoose from 'mongoose'
import { filesCollection } from '../files.constant.js'

export const FileRefSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: filesCollection,
		required: false
	},
	name: { type: String, required: false }, // name without extension
	url: { type: String, required: true } //download file
})
