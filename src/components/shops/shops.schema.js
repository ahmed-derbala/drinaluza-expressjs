import mongoose from 'mongoose'
import * as addressSchema from '../../core/shared/schemas/address.schema.js'
import { OwnerSchema } from '../users/schemas/owner.schema.js'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
const shopsCollection = 'shops'

const shopSchema = new mongoose.Schema(
	{
		owner: { type: OwnerSchema, required: true },
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		name: String,
		location: {
			type: { type: String, enum: ['Point'], default: 'Point' },
			coordinates: [Number]
		},
		address: {
			type: addressSchema,
			select: false
		},
		operatingHours: mongoose.Schema.Types.Mixed,
		deliveryRadiusKm: Number,
		isActive: { type: Boolean, default: true }
	},
	{ timestamps: true, collection: shopsCollection }
)
shopSchema.plugin(slugPlugin, { source: 'name', target: 'slug' })
shopSchema.index({ owner: 1, slug: 1 }, { unique: true })
//Define a case-insensitive unique index
shopSchema.index({ slug: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })
const ShopModel = mongoose.model(shopsCollection, shopSchema)
export { shopsCollection, ShopModel }
