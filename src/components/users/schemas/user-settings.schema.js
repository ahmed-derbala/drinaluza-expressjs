import mongoose from 'mongoose'
import config from '../../../config/default.config.js'

export const UserSettingsSchema = new mongoose.Schema(
	{
		lang: {
			app: {
				type: String,
				required: false,
				default: config.lang.default,
				enum: config.lang.supported
			},
			content: {
				type: String,
				required: false,
				default: config.lang.supported[2],
				enum: config.lang.supported
			}
		},
		currency: { type: String, required: true, default: config.currency.default, enum: config.currency.supported },
		//notifications: { type: String, required: true, default: config.notifications.default, enum: config.notifications.supported }
		notifications: {
			isEnabled: { type: Boolean, required: true, default: true }
		}
	},
	{ _id: false, timestamps: false, select: false }
)
