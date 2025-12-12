import mongoose from 'mongoose'
import { ShopRefSchema } from '../shops/schemas/shop-ref.schema.js'
import { PriceSchema } from './schemas/price.schema.js'
import { FileRefSchema } from '../../core/files/files.schema.js'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
import { DefaultProductRefSchema } from '../default-products/default-products.schema.js'
const productsCollection = 'products'

const ProductSchema = new mongoose.Schema(
	{
		shop: { type: ShopRefSchema, required: false },
		DefaultProduct: { type: DefaultProductRefSchema, required: true },
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		name: {
			type: String, //by default the name of defaultProduct[lang]
			required: true
		},
		price: { type: PriceSchema, required: true },
		//photos: { type: [FileRefSchema], required: true },
		searchTerms: { type: [String], required: true, index: 'text' },
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
				default: 100,
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

const ProductRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: productsCollection,
			required: true
		},
		name: {
			type: String, //by default the name of defaultProduct[lang]
			required: true
		},
		price: { type: PriceSchema, required: true }
	},
	{ timestamps: { createdAt: false, updatedAt: true } }
)
ProductSchema.plugin(slugPlugin, { source: 'name', target: 'slug' })
ProductSchema.index({ slug: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })
ProductSchema.index({ searchTerms: 1 })

export const ProductModel = mongoose.model(productsCollection, ProductSchema)
export { productsCollection }
export { ProductRefSchema }
export default {
	ProductModel,
	productsCollection,
	PriceSchema,
	ProductRefSchema
}
