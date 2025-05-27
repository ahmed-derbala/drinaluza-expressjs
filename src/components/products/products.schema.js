const mongoose = require('mongoose')
const { CreatedByUserSchema } = require('../users/users.schema')
const { BusinessRefSchema } = require('../businesses/businessRef.schema')
const { ShopRefSchema } = require('../shops/shops.schema')
const { defaultProductRefSchema } = require('../default-products/defaultProductRef.schema')

const PriceSchema = new mongoose.Schema(
	{
		tnd: {
			type: Number,
			required: false,
			default: 0,
			min: 0
		},
		eur: {
			type: Number,
			required: false,
			default: 0,
			min: 0
		},
		usd: {
			type: Number,
			required: false,
			default: 0,
			min: 0
		}
	},
	{ _id: false, timestamps: true }
)

const ProductRefSchema = new mongoose.Schema(
	{
		name: {
			type: String, //by default the name of defaultProduct[lang]
			required: true
		},
		price: PriceSchema,
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
		}
	},
	{ _id: false, timestamps: true }
)

const schema = new mongoose.Schema(
	{
		createdByUser: CreatedByUserSchema,
		business: { type: BusinessRefSchema, required: true },
		shops: [{ type: ShopRefSchema, required: [false, 'eeee'] }],
		defaultProduct: { type: defaultProductRefSchema, required: [false, 'eee'] },
		name: {
			type: String, //by default the name of defaultProduct[lang]
			required: true
		},
		price: PriceSchema,
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
	productsCollection,
	PriceSchema,
	ProductRefSchema
}
