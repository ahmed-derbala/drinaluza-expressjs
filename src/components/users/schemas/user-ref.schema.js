import mongoose from 'mongoose'
import { usersCollection } from '../users.constant.js'
import { userRolesEnum } from '../users.enum.js'
import { MultiLangNameSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang-name.schema.js'

export const UserRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		slug: { type: String, required: true },
		name: MultiLangNameSchema,
		role: {
			type: String,
			enum: userRolesEnum.ALL,
			default: userRolesEnum.CUSTOMER
		}
	},
	{ _id: false, timestamps: { createdAt: false, updatedAt: true } }
)
