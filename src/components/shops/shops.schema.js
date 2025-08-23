import mongoose from 'mongoose'
import * as addressSchema from '../../core/shared/schemas/address.schema.js'
import { CreatedByUserSchema, usersCollection } from '../users/users.schema.js'
const shopsCollection = 'shops'
const ShopRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		name: { type: String, required: true }
	},
	{ timestamps: true, required: true }
)
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
export const ShopModel = mongoose.model(shopsCollection, schema)
export { shopsCollection }
export { ShopRefSchema }
export default {
	ShopModel,
	shopsCollection,
	ShopRefSchema
}
