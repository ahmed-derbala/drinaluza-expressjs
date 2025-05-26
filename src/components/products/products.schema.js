const mongoose = require('mongoose')
const { createdByUserSchema } = require('../../core/schemas/createdByUser.schema')
const { businessRefSchema } = require('../../core/schemas/businessRef.schema')
const { shopRefSchema } = require('../../core/schemas/shopRef.schema')
const { defaultProductRefSchema } = require('../../core/schemas/defaultProductRef.schema')
const { priceSchema } = require('../../core/schemas/price.schema')

const schema = new mongoose.Schema(
	{
		createdByUser: createdByUserSchema,
		business: { type: businessRefSchema, required: true },
		shops: [{ type: shopRefSchema, required: [false, 'eeee'] }],
		defaultProduct: { type: defaultProductRefSchema, required: [false, 'eee'] },
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
