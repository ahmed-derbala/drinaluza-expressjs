const mongoose = require('mongoose')
const { BusinessRefSchema } = require('../businesses/businessRef.schema')
const addressSchema = require('../../core/shared/schemas/address.schema')
const { CreatedByUserSchema, usersCollection } = require('../users/users.schema')

const shopsCollection = 'shops'
const ShopRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		business: { type: BusinessRefSchema, required: true },
		name: { type: String, required: true }
	},
	{ timestamps: true, required: true }
)
const schema = new mongoose.Schema(
	{
		createdByUser: CreatedByUserSchema,
		business: { type: BusinessRefSchema, required: true },
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
	shopsCollection,
	ShopRefSchema
}
