const mongoose = require('mongoose')
const { defaultProductsCollection } = require('./default-products.schema')

exports.defaultProductRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: defaultProductsCollection,
			required: true
		},
		name: {
			en: {
				type: String,
				required: true,
				unique: true // Ensures uniqueness for the 'en' field
			},
			tn: {
				type: String,
				required: true,
				unique: true // Ensures uniqueness for the 'tn' field
			},
			tn_ar: {
				type: String,
				required: true,
				unique: true // Ensures uniqueness for the 'tn_ar' field
			}
		}
	},
	{ _id: false, timestamps: true }
)
