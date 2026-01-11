import mongoose from 'mongoose'
import { MultiLangNameSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang-name.schema.js'
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
		name: { type: MultiLangNameSchema, required: true },
		media: MediaSchema
	},
	{ timestamps: { createdAt: false, updatedAt: true } }
)
