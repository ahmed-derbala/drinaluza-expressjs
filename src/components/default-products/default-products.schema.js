import mongoose from 'mongoose'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
import { defaultProductsCollection } from './default-products.constant.js'
import { MultiLangSchema } from '../../core/db/mongodb/shared-schemas/multi-lang.schema.js'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { MediaSchema } from '../../core/db/mongodb/shared-schemas/media.schema.js'
import { searchKeywordsField } from '../../core/db/mongodb/search-keywords.field.js'

const DefaultProductSchema = new mongoose.Schema(
	{
		slug: { type: String, required: true },
		name: { type: MultiLangSchema, required: true },
		searchKeywords: searchKeywordsField,
		media: MediaSchema,
		state: StateSchema
	},
	{ timestamps: true, collection: defaultProductsCollection }
)

DefaultProductSchema.plugin(slugPlugin, { source: 'name', target: 'slug', sub: 'en', unique: true })

export const DefaultProductModel = mongoose.model(defaultProductsCollection, DefaultProductSchema)
