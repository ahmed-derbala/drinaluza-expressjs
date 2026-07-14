import mongoose from 'mongoose'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
import { defaultProductsCollection } from './default-products.constant.js'
import { MultiLangSchema } from '../../core/db/mongodb/shared-schemas/multi-lang.schema.js'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { MediaSchema } from '../../core/db/mongodb/shared-schemas/media.schema.js'
import { searchKeywordsField } from '../../core/db/mongodb/search-keywords.field.js'
import { PriceSubSchema } from '#core'
import { UnitSchema } from '#products/schemas/unit.schema.js'
import { RatingSubschema } from '../reviews/subschemas/rating.subschema.js'
import { SpecsSchema } from '#products/schemas/specs.schema.js'

const DefaultProductSchema = new mongoose.Schema(
	{
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
		rating: { type: RatingSubschema, required: false, _id: false, default: () => ({}) },
		specs: SpecsSchema
	},
	{ collection: defaultProductsCollection }
)

DefaultProductSchema.plugin(slugPlugin, { source: 'name', target: 'slug', sub: 'en', unique: true })

export const DefaultProductModel = mongoose.model(defaultProductsCollection, DefaultProductSchema)
