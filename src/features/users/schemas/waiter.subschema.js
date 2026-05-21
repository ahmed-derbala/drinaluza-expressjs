import mongoose from 'mongoose'
import { usersCollection } from '../users.constant.js'
import { MultiLangSchema } from '#multilang'

export const WaiterSchema = {
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: usersCollection,
		required: true
	},
	slug: { type: String, required: true },
	name: MultiLangSchema
}
