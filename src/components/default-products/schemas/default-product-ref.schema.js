import mongoose from 'mongoose'
import { MultiLangSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang.schema.js'
import { defaultProductsCollection } from '../default-products.constant.js'
import { MediaSchema } from '../../../core/db/mongodb/shared-schemas/media.schema.js'

export const DefaultProductRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: defaultProductsCollection,
			required: true
		},
		slug: { type: String, required: true },
		name: { type: MultiLangSchema, required: true },
		media: MediaSchema
	},
	{ timestamps: { createdAt: false, updatedAt: true } }
)
