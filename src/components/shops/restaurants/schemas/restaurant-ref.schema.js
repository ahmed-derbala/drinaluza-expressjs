import mongoose from 'mongoose'
import { AddressSchema } from '#address'
import { LocationSchema } from '#location'
import { shopsCollection } from '#shops/shops.constant.js'
import { MultiLangSchema } from '#multilang'
import { OwnerSchema } from '#users/schemas/owner.schema.js'

export const RestaurantRefSchema = {
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: shopsCollection,
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
