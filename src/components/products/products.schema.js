import mongoose from 'mongoose'
import { ShopRefSchema } from '../shops/schemas/shop-ref.schema.js'
import { PriceSchema } from './schemas/price.schema.js'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
import { DefaultProductRefSchema } from '../default-products/schemas/default-product-ref.schema.js'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { MultiLangSchema } from '../../core/db/mongodb/shared-schemas/multi-lang.schema.js'
import { UnitSchema } from './schemas/unit.schema.js'
import { MediaSchema } from '../../core/db/mongodb/shared-schemas/media.schema.js'
import { searchKeywordsField } from '../../core/db/mongodb/search-keywords.field.js'
export const productsCollection = 'products'

const ProductSchema = new mongoose.Schema(
	{
		shop: { type: ShopRefSchema, required: true },
		defaultProduct: { type: DefaultProductRefSchema, required: true },
		slug: { type: String, required: true },
		name: MultiLangSchema,
		price: { type: PriceSchema, required: true },
		unit: { type: UnitSchema, required: true },
		searchKeywords: searchKeywordsField,
		state: StateSchema,
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
		},
		media: MediaSchema
	},
	{ timestamps: true }
)

ProductSchema.plugin(slugPlugin, { source: 'name', target: 'slug', sub: 'en', unique: false })
//ProductSchema.index({ slug: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })

export const ProductModel = mongoose.model(productsCollection, ProductSchema)
