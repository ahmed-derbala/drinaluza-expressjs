import mongoose from 'mongoose'
import { MultiLangSchema } from '#schemas/multi-lang.schema.js'

export const AuthorSubschema = {
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: false
	},
	slug: { type: String, required: true },
	name: MultiLangSchema
}
