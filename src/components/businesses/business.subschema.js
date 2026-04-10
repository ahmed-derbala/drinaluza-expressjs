import mongoose from 'mongoose'
import { businessesCollection } from './businesses.constant.js'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { MultiLangSchema } from '../../core/db/mongodb/shared-schemas/multi-lang.schema.js'

export const BusinessRefSubSchema = {
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: businessesCollection,
		required: true
	},
	slug: {
		type: String,
		required: true
	},
	name: MultiLangSchema,
	state: StateSchema
}
