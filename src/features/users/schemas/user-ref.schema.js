import mongoose from 'mongoose'
import { usersCollection, USER_ROLES, USER_ROLES_ALL } from '../users.constant.js'
import { MultiLangSchema } from '#schemas/multi-lang.schema.js'

export const UserRefSchema = {
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: usersCollection,
		required: true
	},
	slug: { type: String, required: true },
	name: MultiLangSchema,
	roles: {
		type: [String],
		enum: USER_ROLES_ALL,
		default: USER_ROLES.customer,
		required: true
	}
}
