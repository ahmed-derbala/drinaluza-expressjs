import mongoose from 'mongoose'
import { AddressSchema } from '#schemas/address.schema.js'
import { LocationSchema } from '#schemas/location.schema.js'
import { businessesCollection } from '../businesses.constant.js'
import { MultiLangSchema } from '#schemas/multi-lang.schema.js'
import { OwnerSchema } from '../../users/schemas/owner.schema.js'
import { MediaSchema } from '#schemas/media.schema.js'
import { ContactSchema } from '#schemas/contact.schema.js'

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
	media: { type: MediaSchema, required: false, default: () => ({}) },
	contact: ContactSchema
}
