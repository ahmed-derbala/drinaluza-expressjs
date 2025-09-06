import mongoose from 'mongoose'
import { usersCollection } from '../../users/users.constant.js'
import { CreatedByUserSchema } from '../../users/schemas/created-by-user.schema.js'
export const ShopRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		name: { type: String, required: true },
		createdByUser: { type: CreatedByUserSchema, required: true }
	},
	{ timestamps: true, required: true }
)
