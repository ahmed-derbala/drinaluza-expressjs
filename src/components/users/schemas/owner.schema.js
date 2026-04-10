import mongoose from 'mongoose'
import { usersCollection } from '../users.constant.js'
import { BusinessRefSubSchema } from '../../businesses/business.subschema.js'
import { MultiLangSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang.schema.js'

export const OwnerSchema = {
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: usersCollection,
		required: true
	},
	business: { type: BusinessRefSubSchema, required: true },
	slug: { type: String, required: true },
	name: MultiLangSchema
}
