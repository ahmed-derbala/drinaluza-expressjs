const mongoose = require('mongoose')
const { ShopRefSchema } = require('../shops/shops.schema')
const { CreatedByUserSchema, usersCollection } = require('../users/users.schema')
const businessesCollection = 'businesses'

const schema = new mongoose.Schema(
	{
		name: String,
		createdByUser: CreatedByUserSchema,
		shops: [{ type: ShopRefSchema, required: [false, 'eeee'] }]
	},
	{ timestamps: true, collection: businessesCollection }
)

module.exports = {
	BusinessModel: mongoose.model(businessesCollection, schema),
	businessesCollection
}
