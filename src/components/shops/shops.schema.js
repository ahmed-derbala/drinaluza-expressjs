import mongoose from 'mongoose'
import * as addressSchema from '../../core/shared/schemas/address.schema.js'
import { CreatedByUserSchema } from '../users/schemas/created-by-user.schema.js'
const shopsCollection = 'shops'

const schema = new mongoose.Schema(
	{
		createdByUser: CreatedByUserSchema,
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
const ShopModel = mongoose.model(shopsCollection, schema)
export { shopsCollection, ShopModel }
