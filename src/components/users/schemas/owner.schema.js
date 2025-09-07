import mongoose from 'mongoose'
import { usersCollection } from '../users.constant.js'

export const OwnerSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		slug: { type: String, required: true },
		name: { type: String, required: true }
	},
	{ _id: false, timestamps: { createdAt: false, updatedAt: true } }
)
