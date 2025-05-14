const mongoose = require('mongoose')

const defaultProductsCollection = 'default-products'

const schema = new mongoose.Schema(
	{
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
		},
		searchKeywords: {
			type: [String],
			required: true,
			validate: {
				validator: function (array) {
					return array.length >= 2 // Minimum length of 2
				},
				message: 'searchKeywords must have at least 2 items' // Fixed message to match validator
			}
		},
		isActive: {
			type: Boolean,
			default: true
		}
	},
	{ timestamps: true, collection: defaultProductsCollection }
)

// Optional: Add indexes explicitly to handle unique constraint errors gracefully
schema.index({ 'name.en': 1 }, { unique: true })
schema.index({ 'name.tn': 1 }, { unique: true })
schema.index({ 'name.tn_ar': 1 }, { unique: true })

module.exports = {
	DefaultProductsModel: mongoose.model(defaultProductsCollection, schema),
	defaultProductsCollection
}
