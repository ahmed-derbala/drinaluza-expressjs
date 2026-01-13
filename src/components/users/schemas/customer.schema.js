import mongoose from 'mongoose'
import { usersCollection } from '../users.constant.js'
import { MultiLangNameSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang-name.schema.js'
import { AddressSchema } from '../../../core/db/mongodb/shared-schemas/address.schema.js'
import { LocationSchema } from '../../../core/db/mongodb/shared-schemas/location.schema.js'
import { ContactSchema } from '../../../core/db/mongodb/shared-schemas/contact.schema.js'
import { MediaThumbnailSchema } from '../../../core/db/mongodb/shared-schemas/media-thumbnail.schema.js'

export const customerSelect = '+slug +name +address +location +contact +media +role'

export const CustomerSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		role: { type: String, required: true },
		slug: { type: String, required: true },
		name: MultiLangNameSchema,
		address: AddressSchema,
		location: LocationSchema,
		contact: ContactSchema,
		media: MediaThumbnailSchema
	},
	{ _id: false, timestamps: { createdAt: false, updatedAt: true } }
)
CustomerSchema.index({ location: '2dsphere' })
