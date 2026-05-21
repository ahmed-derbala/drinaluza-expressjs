import mongoose from 'mongoose'
import { usersCollection } from '../users.constant.js'
import { USER_ROLES } from '../users.enum.js'
import { MultiLangSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang.schema.js'

export const UserRefSchema = {
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: usersCollection,
		required: true
	},
	slug: { type: String, required: true },
	name: MultiLangSchema,
	role: {
		type: String,
		enum: USER_ROLES.ALL,
		default: USER_ROLES.CUSTOMER
	}
}
