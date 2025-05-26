const mongoose = require('mongoose')
const { createdBySchema } = require('../../core/schemas/createdBy.schema')
const { businessRefSchema } = require('../../core/schemas/businessRef.schema')
const { shopRefSchema } = require('../../core/schemas/shopRef.schema')
const { defaultProductRefSchema } = require('../../core/schemas/defaultProductRef.schema')
const { priceSchema } = require('../../core/schemas/price.schema')

const schema = new mongoose.Schema(
	{
		createdBy: createdBySchema,
		business: businessRefSchema,
		shops: [shopRefSchema],
		defaultProduct: defaultProductRefSchema,
		name: {
			type: String, //by default the name of defaultProduct[lang]
			required: true
		},
		price: priceSchema,
		unit: {
			name: {
				type: String,
				enum: ['KG', 'L', 'piece'],
				default: 'KG'
			},
			min: {
				type: Number,
				default: 1,
				min: 1
			}
		},
		searchTerms: [String],
		isActive: {
			type: Boolean,
			default: true
		},
		availability: {
			startDate: { type: Date, required: true, default: Date.now },
			endDate: { type: Date, required: false, default: null }
		}
	},
	{ timestamps: true }
)

const productsCollection = 'products'

module.exports = {
	ProductModel: mongoose.model(productsCollection, schema),
	productsCollection
}
