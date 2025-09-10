import mongoose from 'mongoose'
import { usersCollection } from '../../users/users.constant.js'
import { OwnerSchema } from '../../users/schemas/owner.schema.js'
import { AddressSchema } from '../../../core/db/mongodb/shared-schemas/address.schema.js'
import { LocationSchema } from '../../../core/db/mongodb/shared-schemas/location.schema.js'

export const ShopRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		name: { type: String, required: true },
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		owner: { type: OwnerSchema, required: true },
		address: {
			type: AddressSchema
		},
		location: {
			type: LocationSchema
		}
	},
	{ timestamps: true, required: true }
)
