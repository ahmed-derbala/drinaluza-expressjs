import mongoose from 'mongoose'
import { CreatedByUserSchema } from '../users/users.schema.js'
import { ShopRefSchema } from '../shops/shops.schema.js'
import { priceUnitEnum } from './products.enum.js'
import { FileRefSchema } from '../../core/files/files.schema.js'

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
		createdByUser: { type: CreatedByUserSchema, required: true },
		shop: { type: ShopRefSchema, required: false },
		name: {
			type: String, //by default the name of defaultProduct[lang]
			required: true
		},
		price: { type: PriceSchema, required: true },
		photos: { type: [FileRefSchema], required: true },
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
export const ProductModel = mongoose.model(productsCollection, ProductSchema)
export { productsCollection }
export { PriceSchema }
export { ProductRefSchema }
export default {
	ProductModel,
	productsCollection,
	PriceSchema,
	ProductRefSchema
}
