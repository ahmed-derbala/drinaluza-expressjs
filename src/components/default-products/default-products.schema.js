import mongoose from 'mongoose'
import { slugPlugin, slugDefObject } from '../../core/db/mongodb/slug-plugin.js'
import { defaultProductsCollection } from './default-products.constant.js'
import { MultiLangNameSchema } from '../../core/db/mongodb/shared-schemas/multi-lang-name.schema.js'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'

const DefaultProductSchema = new mongoose.Schema(
	{
		slug: slugDefObject,
		name: { type: MultiLangNameSchema, required: true },
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
				url: { type: String, required: false }
			}
		},
		state: StateSchema
	},
	{ timestamps: true, collection: defaultProductsCollection }
)

DefaultProductSchema.plugin(slugPlugin, { source: 'name', target: 'slug', sub: 'en' })
DefaultProductSchema.index({ slug: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })

export const DefaultProductModel = mongoose.model(defaultProductsCollection, DefaultProductSchema)
