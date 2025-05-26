const mongoose = require('mongoose')
const { businessRefSchema } = require('../../core/schemas/businessRef.schema')
const addressSchema = require('../../core/schemas/address.schema')
const { createdByUserSchema } = require('../../core/schemas/createdByUser.schema')

const shopsCollection = 'shops'

const schema = new mongoose.Schema(
	{
		createdByUser: createdByUserSchema,
		business: { type: businessRefSchema, required: true },
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

module.exports = {
	ShopModel: mongoose.model(shopsCollection, schema),
	shopsCollection
}
