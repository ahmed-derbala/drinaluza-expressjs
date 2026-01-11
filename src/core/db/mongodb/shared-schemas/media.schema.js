import mongoose from 'mongoose'
import config from '../../../../config/index.js'

export const MediaSchema = new mongoose.Schema(
	{
		thumbnail: {
			url: { type: String, required: true, default: `${config.backend.url}/public/favicon.ico` }
		}
	},
	{ _id: false, timestamps: { updatedAt: true, createdAt: false } }
)
