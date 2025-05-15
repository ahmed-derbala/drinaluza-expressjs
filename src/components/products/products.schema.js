const mongoose = require('mongoose')
const { usersCollection } = require('../users/users.schema')
const { defaultProductsCollection } = require('../default-products/default-products.schema')

const schema = new mongoose.Schema(
	{
		defaultProduct: {
			type: mongoose.Schema.Types.ObjectId,
			ref: defaultProductsCollection,
			required: true
		},
		name: {
			en: {
				type: String,
				required: true
			},
			tn: {
				type: String,
				required: true
			},
			tn_ar: {
				type: String,
				required: true
			}
		},
		price: {
			tnd: {
				type: String,
				required: true,
				default: 0,
				min: 0
			},
			eur: {
				type: String,
				required: false,
				default: 0,
				min: 0
			}
		},
		unit: {
			name: {
				type: String,
				enum: ['KG', 'L'],
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
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		}
	},
	{ timestamps: true }
)

const productsCollection = 'products'

module.exports = {
	ProductModel: mongoose.model(productsCollection, schema),
	productsCollection
}
