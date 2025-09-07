import mongoose from 'mongoose'
import * as addressSchema from '../../core/shared/schemas/address.schema.js'
import { OwnerSchema } from '../users/schemas/owner.schema.js'
const shopsCollection = 'shops'

const shopSchema = new mongoose.Schema(
	{
		owner: { type: OwnerSchema, required: true },
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
shopSchema.index({ owner: 1, name: 1 }, { unique: true })

const ShopModel = mongoose.model(shopsCollection, shopSchema)
export { shopsCollection, ShopModel }
