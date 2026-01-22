import mongoose from 'mongoose'
import { businessesCollection } from '../businesses.constant.js'
import { StateSchema } from '../../../core/db/mongodb/shared-schemas/state.schema.js'
import { MultiLangNameSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang-name.schema.js'

export const BusinessRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: businessesCollection,
			required: true
		},
		slug: {
			type: String,
			required: true
		},
		name: { type: MultiLangNameSchema, required: true },
		state: { type: StateSchema, required: true }
	},
	{ _id: false }
)
