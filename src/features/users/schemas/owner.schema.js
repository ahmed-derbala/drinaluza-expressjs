import mongoose from 'mongoose'
import { usersCollection } from '../users.constant.js'
import { MultiLangSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang.schema.js'
import { MediaSchema } from '#core'
export const OwnerSchema = {
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: usersCollection,
		required: true
	},
	slug: { type: String, required: true },
	name: MultiLangSchema,
	media: MediaSchema
}
