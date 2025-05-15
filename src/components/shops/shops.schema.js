const mongoose = require('mongoose')
const { usersCollection } = require('../users/users.schema')
const { businessesCollection } = require('../businesses/businesses.schema')

const shopsCollection = 'shops'

const schema = new mongoose.Schema(
	{
		name: String,
		businessId: { type: Schema.Types.ObjectId, ref: businessesCollection, required: true },
		location: {
			type: { type: String, enum: ['Point'], default: 'Point' },
			coordinates: [Number]
		},
		address: String,
		operatingHours: Schema.Types.Mixed,
		deliveryRadiusKm: Number,
		isActive: { type: Boolean, default: true }
	},
	{ timestamps: true, collection: shopsCollection }
)

module.exports = {
	ShopModel: mongoose.model(shopsCollection, schema),
	shopsCollection
}
