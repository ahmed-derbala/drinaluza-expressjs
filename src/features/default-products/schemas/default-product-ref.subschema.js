import mongoose from 'mongoose'
import { MultiLangSchema } from '#schemas/multi-lang.schema.js'
import { defaultProductsCollection } from '../default-products.constant.js'
import { MediaSchema } from '#schemas/media.schema.js'

export const DefaultProductRefSubSchema = {
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: defaultProductsCollection,
		required: true
	},
	slug: { type: String, required: true },
	name: { type: MultiLangSchema, required: true },
	media: MediaSchema
}
