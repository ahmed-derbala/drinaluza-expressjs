import mongoose from 'mongoose'
import { usersCollection } from '../users.constant.js'
import { BusinessRefSchema } from '../../businesses/schemas/business-ref.schema.js'
import { MultiLangSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang.schema.js'

export const OwnerSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		business: { type: BusinessRefSchema, required: true },
		slug: { type: String, required: true },
		name: MultiLangSchema
	},
	{ _id: false, timestamps: { createdAt: false, updatedAt: true } }
)
