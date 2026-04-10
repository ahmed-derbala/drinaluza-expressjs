import mongoose from 'mongoose'
import { UserRefSchema } from '../../components/users/schemas/user-ref.schema.js'
import { StateSchema } from '../db/mongodb/shared-schemas/state.schema.js'
import { MultiLangSchema } from '../db/mongodb/shared-schemas/multi-lang.schema.js'

const notificationsCollection = 'notifications'

const NotificationSchema = new mongoose.Schema(
	{
		user: UserRefSchema,
		template: { slug: { type: String, required: true } },
		title: MultiLangSchema,
		content: MultiLangSchema,
		seenAt: { type: Date },
		kind: { type: String, enum: ['push', 'email', 'sms'], default: 'push', required: true, select: false },
		state: StateSchema,
		priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium', required: true }
	},
	{ collection: notificationsCollection, timestamps: true }
)
export const NotificationModel = mongoose.model(notificationsCollection, NotificationSchema)
