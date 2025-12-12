import mongoose from 'mongoose'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'

export const defaultProductsCollection = 'default-products'

const DefaultProductSchema = new mongoose.Schema(
	{
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		name: {
			en: {
				type: String,
				required: true,
				unique: true
			}
			/*tn_en: {
				//tunisian with latin alphabet
				type: String,
				required: true,
				unique: true
			},
			tn_ar: {
				//tunisian with arabic alphabet
				type: String,
				required: true,
				unique: true
			},
			fr: {
				type: String,
				required: true,
				unique: true
			},*/
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
		images: {
			thumbnail: {
				url: { type: String, required: true }
			}
		},
		isActive: {
			type: Boolean,
			default: true
		}
	},
	{ timestamps: true, collection: defaultProductsCollection }
)

export const DefaultProductRefSchema = new mongoose.Schema(
	{
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: defaultProductsCollection,
			required: true
		},
		name: {
			en: {
				type: String,
				required: true,
				unique: true
			}
			/*tn_en: {
				//tunisian with latin alphabet
				type: String,
				required: true,
				unique: true
			},
			tn_ar: {
				//tunisian with arabic alphabet
				type: String,
				required: true,
				unique: true
			},
			fr: {
				type: String,
				required: true,
				unique: true
			},*/
		},
		images: {
			thumbnail: {
				url: { type: String, required: true }
			}
		}
	},
	{ timestamps: { createdAt: false, updatedAt: true } }
)

DefaultProductSchema.plugin(slugPlugin, { source: 'name', target: 'slug', sub: 'en' })
//DefaultProductSchema.index({ slug: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })

export const DefaultProductModel = mongoose.model(defaultProductsCollection, DefaultProductSchema)
