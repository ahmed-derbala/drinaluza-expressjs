import mongoose from 'mongoose'
import { UserRefSchema } from '../../features/users/schemas/user-ref.schema.js'
import { StateSchema } from '#schemas/state.schema.js'
import { MultiLangSchema } from '#schemas/multi-lang.schema.js'
import { NOTIFICATIONS_TEMPLATES_ALL } from './notifications.constant.js'
import { MediaSchema } from '#schemas/media.schema.js'
import { CustomerSchema } from '#users/schemas/customer.schema.js'
import { BusinessRefSchema } from '#businesses/schemas/business-ref.schema.js'

const notificationsCollection = 'notifications'

const NotificationSchema = new mongoose.Schema(
	{
		user: UserRefSchema,
		media: MediaSchema,
		customer: { type: CustomerSchema, required: false },
		business: { type: BusinessRefSchema, required: false },
		template: { slug: { type: String, required: true, enum: NOTIFICATIONS_TEMPLATES_ALL() } },
		screen: { type: String, default: '/notifications' },
		title: MultiLangSchema,
		content: MultiLangSchema,
		seenAt: { type: Date },
		kind: { type: String, enum: ['push', 'email', 'sms'], default: 'push', required: true, select: false },
		state: StateSchema,
		priority: { type: String, enum: ['default', 'normal', 'high'], default: 'high', required: true }
	},
	{ collection: notificationsCollection, timestamps: true }
)
export const NotificationModel = mongoose.model(notificationsCollection, NotificationSchema)
