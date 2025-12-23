import mongoose from 'mongoose'
import { AddressSchema } from '../../core/db/mongodb/shared-schemas/address.schema.js'
import { LocationSchema } from '../../core/db/mongodb/shared-schemas/location.schema.js'
import { OwnerSchema } from '../users/schemas/owner.schema.js'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'

export const shopsCollection = 'shops'

const shopSchema = new mongoose.Schema(
	{
		owner: { type: OwnerSchema, required: true },
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		name: {
			type: String,
			required: true,
			trim: true
		},
		address: {
			type: AddressSchema
		},
		location: {
			type: LocationSchema
		},
		deliveryRadiusKm: Number,
		isActive: { type: Boolean, default: true }
	},
	{ timestamps: true, collection: shopsCollection }
)
shopSchema.plugin(slugPlugin, { source: 'name', target: 'slug' })
shopSchema.index({ owner: 1, slug: 1 }, { unique: true })
//Define a case-insensitive unique index
shopSchema.index({ slug: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })
export const ShopModel = mongoose.model(shopsCollection, shopSchema)
