const mongoose = require('mongoose')
const { CreatedByUserSchema } = require('../users/users.schema')
const { BusinessRefSchema } = require('../businesses/businessRef.schema')
const { ShopRefSchema } = require('../shops/shops.schema')
const { defaultProductRefSchema } = require('../default-products/defaultProductRef.schema')
const { priceUnitEnum } = require('./products.enum')

const PriceSchema = new mongoose.Schema(
	{
		value: {
			tnd: {
				type: Number,
				required: true,
				default: 0,
				min: 0
			},
			eur: {
				type: Number,
				required: false,
				//default: 0,
				min: 0
			},
			usd: {
				type: Number,
				required: false,
				//default: 0,
				min: 0
			}
		},
		unit: {
			name: {
				type: String,
				required: true,
				enum: priceUnitEnum.all,
				default: priceUnitEnum.KG
			},
			min: {
				//when the seller wants a minimum quantity to sell
				type: Number,
				required: true,
				default: 1,
				min: 1
			}
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
		price: { type: PriceSchema, required: true }
	},
	{ timestamps: { createdAt: false, updatedAt: true } }
)

const ProductSchema = new mongoose.Schema(
	{
		createdByUser: CreatedByUserSchema,
		business: { type: BusinessRefSchema, required: false },
		shops: [{ type: ShopRefSchema, required: false }],
		defaultProduct: { type: defaultProductRefSchema, required: false },
		name: {
			type: String, //by default the name of defaultProduct[lang]
			required: true
		},
		price: { type: PriceSchema, required: true },
		searchTerms: [String],
		isActive: {
			type: Boolean,
			default: true
		},
		availability: {
			startDate: { type: Date, required: true, default: Date.now },
			endDate: { type: Date, required: false, default: null }
		},
		stock: {
			quantity: {
				type: Number,
				required: true,
				default: 0,
				min: 0,
				validate: {
					validator: Number.isInteger,
					message: 'Stock quantity must be an integer'
				}
			},
			minThreshold: {
				type: Number,
				required: true,
				default: 10,
				min: 0,
				validate: {
					validator: Number.isInteger,
					message: 'Minimum stock threshold must be an integer'
				}
			}
		}
	},
	{ timestamps: true }
)

const productsCollection = 'products'

module.exports = {
	ProductModel: mongoose.model(productsCollection, ProductSchema),
	productsCollection,
	PriceSchema,
	ProductRefSchema
}
