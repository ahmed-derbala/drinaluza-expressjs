import mongoose from 'mongoose'
import { usersCollection } from '../../users/users.constant.js'
import { OwnerSchema } from '../../users/schemas/owner.schema.js'
export const ShopRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		name: { type: String, required: true },
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		owner: { type: OwnerSchema, required: true }
	},
	{ timestamps: true, required: true }
)
