import mongoose from 'mongoose'
import { ShopRefSchema } from '../shops/schemas/shop-ref.schema.js'
import { PriceSubSchema } from './schemas/price.schema.js'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
import { DefaultProductRefSubSchema } from '../default-products/schemas/default-product-ref.subschema.js'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { MultiLangSchema } from '../../core/db/mongodb/shared-schemas/multi-lang.schema.js'
import { UnitSchema } from './schemas/unit.schema.js'
import { MediaSchema } from '../../core/db/mongodb/shared-schemas/media.schema.js'
import { searchKeywordsField } from '../../core/db/mongodb/search-keywords.field.js'
import { RatingSubschema } from '../reviews/subschemas/rating.subschema.js'
import { FeedModel } from '../feed/feed.schema.js'
import { productsCollection } from './products.constant.js'

const ProductSchema = new mongoose.Schema(
	{
		shop: ShopRefSchema,
		defaultProduct: { type: DefaultProductRefSubSchema, required: true },
		slug: { type: String, required: true },
		name: MultiLangSchema,
		price: { type: PriceSubSchema, required: true, _id: false },
		unit: { type: UnitSchema, required: true, _id: false },
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
		media: MediaSchema,
		rating: { type: RatingSubschema, required: false, _id: false, default: () => ({}) }
	},
	{ timestamps: true, collection: productsCollection }
)

ProductSchema.plugin(slugPlugin, { source: 'name', target: 'slug', sub: 'en', unique: false })

ProductSchema.post('findOneAndUpdate', async function (doc) {
	if (!doc) return
	try {
		await FeedModel.updateMany(
			{
				targetId: doc._id,
				targetResource: productsCollection
			},
			{
				$set: {
					'targetData.rating': doc.rating
				}
			}
		)
	} catch (error) {
		console.error('Failed to sync Shop rating to Feed:', error)
	}
})
export const ProductModel = mongoose.model(productsCollection, ProductSchema)
