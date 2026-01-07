import mongoose from 'mongoose'
import config from '../../../config/default.config.js'

export const UserSettingsSchema = new mongoose.Schema(
	{
		lang: {
			app: {
				type: String,
				required: true,
				default: config.lang.default,
				enum: config.lang.supported
			},
			content: {
				type: String,
				required: true,
				default: config.lang.default,
				enum: config.lang.supported
			}
		},
		currency: { type: String, required: true, default: 'tnd', enum: ['tnd', 'eur', 'usd'] } //tnd,eur,usd
	},
	{ _id: false, timestamps: { createdAt: false }, select: false }
)
