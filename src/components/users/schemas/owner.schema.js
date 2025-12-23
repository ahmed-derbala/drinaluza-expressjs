import mongoose from 'mongoose'
import { usersCollection } from '../users.constant.js'
import { BusinessRefSchema } from '../../businesses/schemas/business-ref.schema.js'

export const OwnerSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		business: { type: BusinessRefSchema, required: false },
		slug: { type: String, required: true },
		name: { type: String, required: true }
	},
	{ _id: false, timestamps: { createdAt: false, updatedAt: true } }
)
