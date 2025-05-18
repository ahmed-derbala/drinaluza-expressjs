const mongoose = require('mongoose')
const { shopsCollection } = require('../shops/shops.schema')
const ownerSchema = require('../../core/schemas/owner.schema')

const businessesCollection = 'businesses'

const schema = new mongoose.Schema(
	{
		name: String,
		owner: ownerSchema,
		shops: [
			{
				_id: { type: Schema.Types.ObjectId, ref: shopsCollection },
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
