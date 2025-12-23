import mongoose from 'mongoose'
import { usersCollection } from '../../users/users.constant.js'
import { AddressSchema } from '../../../core/db/mongodb/shared-schemas/address.schema.js'
import { LocationSchema } from '../../../core/db/mongodb/shared-schemas/location.schema.js'
import { shopsCollection } from '../shops.constants.js'

export const ShopRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: shopsCollection,
			required: true
		},
		owner: {
			type: {
				_id: { type: mongoose.Schema.Types.ObjectId, ref: usersCollection, required: true },
				slug: { type: String, required: true },
				name: { type: String, required: true }
			},
			required: true
		},
		name: { type: String, required: true },
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
