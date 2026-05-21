import mongoose from 'mongoose'
import { AddressSchema } from '../../../core/db/mongodb/shared-schemas/address.schema.js'
import { LocationSchema } from '../../../core/db/mongodb/shared-schemas/location.schema.js'
import { businessesCollection } from '../businesses.constant.js'
import { MultiLangSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang.schema.js'
import { OwnerSchema } from '../../users/schemas/owner.schema.js'
import { MediaSchema } from '../../../core/db/mongodb/shared-schemas/media.schema.js'

export const BusinessRefSchema = {
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: businessesCollection,
		required: true
	},
	owner: { type: OwnerSchema, required: true },
	name: { type: MultiLangSchema, required: true },
	slug: {
		type: String,
		required: true,
		trim: true,
		lowercase: true
	},
	address: {
		type: AddressSchema
	},
	location: LocationSchema,
	media: { type: MediaSchema, required: false, default: () => ({}) }
}
