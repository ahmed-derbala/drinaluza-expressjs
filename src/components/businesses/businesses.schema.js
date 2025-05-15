const mongoose = require('mongoose')
const { usersCollection } = require('../users/users.schema')
const { shopsCollection } = require('../shops/shops.schema')

const businessesCollection = 'businesses'

const schema = new mongoose.Schema(
	{
		name: String,
		ownerId: { type: Schema.Types.ObjectId, ref: usersCollection, required: true },
		ownerName: String,
		shops: [
			{
				shopId: { type: Schema.Types.ObjectId, ref: shopsCollection },
				name: String,
				isActive: Boolean
			}
		]
	},
	{ timestamps: true, collection: businessesCollection }
)

module.exports = {
	BusinessModel: mongoose.model(businessesCollection, schema),
	businessesCollection
}
