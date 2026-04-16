import mongoose from 'mongoose'
import { MultiLangSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang.schema.js'

export const AuthorSubschema = {
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: false
	},
	slug: { type: String, required: true },
	name: MultiLangSchema
}
