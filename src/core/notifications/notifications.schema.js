import mongoose from 'mongoose'
import { UserRefSchema } from '../../components/users/schemas/user-ref.schema.js'
import { StateSchema } from '../db/mongodb/shared-schemas/state.schema.js'

const notificationsCollection = 'notifications'

const NotificationSchema = new mongoose.Schema(
	{
		user: UserRefSchema,
		title: { type: String, required: true },
		content: { type: String, required: true },
		at: { type: String, enum: ['now', 'date', 'later'], default: 'now' },
		sendAt: { type: Date, default: Date.now },
		seenAt: { type: Date },
		kind: { type: String, enum: ['push', 'email', 'sms'], default: 'push', required: false },
		state: StateSchema
	},
	{ collection: notificationsCollection, timestamps: true }
)
export const NotificationModel = mongoose.model(notificationsCollection, NotificationSchema)
