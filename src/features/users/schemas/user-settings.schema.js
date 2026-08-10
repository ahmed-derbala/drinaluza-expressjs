import mongoose from 'mongoose'
import config from '../../../config/default.config.js'

export const UserSettingsSchema = {
	_id: false,
	language: {
		app: {
			type: String,
			required: false,
			default: config.language.default,
			enum: config.language.supported
		},
		content: {
			type: String,
			required: false,
			default: config.language.supported[2],
			enum: config.language.supported
		}
	},
	currency: { type: String, required: true, default: config.currency.default, enum: config.currency.supported },
	//notifications: { type: String, required: true, default: config.notifications.default, enum: config.notifications.supported }
	notifications: {
		isEnabled: { type: Boolean, required: true, default: true }
	},
	purchases: {
		confirmation: {
			isEnabled: { type: Boolean, required: true, default: true }
		}
	}
}
