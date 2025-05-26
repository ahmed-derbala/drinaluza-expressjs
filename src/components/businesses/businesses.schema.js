const mongoose = require('mongoose')
const { shopRefSchema } = require('../../core/schemas/shopRef.schema')
const { createdByUserSchema } = require('../../core/schemas/createdByUser.schema')
const businessesCollection = 'businesses'

const schema = new mongoose.Schema(
	{
		name: String,
		createdByUser: createdByUserSchema,
		shops: [{ type: shopRefSchema, required: [false, 'eeee'] }]
	},
	{ timestamps: true, collection: businessesCollection }
)

module.exports = {
	BusinessModel: mongoose.model(businessesCollection, schema),
	businessesCollection
}
