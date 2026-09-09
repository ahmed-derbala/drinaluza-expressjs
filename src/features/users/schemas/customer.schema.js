import mongoose from 'mongoose'
import { usersCollection } from '../users.constant.js'
import { MultiLangSchema } from '#schemas/multi-lang.schema.js'
import { AddressSchema } from '#schemas/address.schema.js'
import { LocationSchema } from '#schemas/location.schema.js'
import { ContactSchema } from '#schemas/contact.schema.js'
import { MediaSchema } from '#schemas/media.schema.js'

export const customerSelect = '+slug +name +address +location +contact +media +roles'

export const CustomerSchema = {
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: usersCollection,
		required: true
	},
	slug: { type: String, required: true },
	name: MultiLangSchema,
	address: { type: AddressSchema, required: false },
	location: LocationSchema,
	contact: ContactSchema,
	media: MediaSchema
}
