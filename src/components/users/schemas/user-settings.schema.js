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
				default: config.lang.default,
				enum: config.lang.supported
			}
		},
		currency: { type: String, required: true, default: config.currency.default, enum: config.currency.supported }
	},
	{ _id: false, timestamps: false, select: false }
)

/*
export const UserSettingsSchema = 
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
		currency: { type: String, required: true, default: config.currency.default, enum: config.currency.supported } //tnd,eur,usd
	}
	*/
