const mongoose = require('mongoose')
const { PriceSchema } = require('./price.schema')

exports.ProductRefSchema = new mongoose.Schema(
	{
		/*createdByUser: createdByUserSchema,
		business: { type: businessRefSchema, required: true },
		shops: [{ type: shopRefSchema, required: [false, 'eeee'] }],
		defaultProduct: { type: defaultProductRefSchema, required: [false, 'eee'] },*/
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
		/*	searchTerms: [String],
		isActive: {
			type: Boolean,
			default: true
		},
		availability: {
			startDate: { type: Date, required: true, default: Date.now },
			endDate: { type: Date, required: false, default: null }
		}*/
	},
	{ _id: false, timestamps: true }
)
