import mongoose from 'mongoose'
import { AddressSchema } from '../../../core/db/mongodb/shared-schemas/address.schema.js'
import { LocationSchema } from '../../../core/db/mongodb/shared-schemas/location.schema.js'
import { shopsCollection } from '../shops.constants.js'
import { MultiLangNameSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang-name.schema.js'
import { OwnerSchema } from '../../users/schemas/owner.schema.js'

export const ShopRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: shopsCollection,
			required: true
		},
		owner: { type: OwnerSchema, required: true },
		name: MultiLangNameSchema,
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		address: {
			type: AddressSchema
		},
		location: {
			type: LocationSchema
		}
	},
	{ timestamps: true, required: true }
)
