import mongoose from 'mongoose'
import { AddressSchema } from '#schemas/address.schema.js'
import { LocationSchema } from '#schemas/location.schema.js'
import { businessesCollection } from '#businesses/businesses.constant.js'
import { MultiLangSchema } from '#schemas/multi-lang.schema.js'
import { OwnerSchema } from '#users/schemas/owner.schema.js'

export const RestaurantRefSchema = {
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
	location: LocationSchema
}
