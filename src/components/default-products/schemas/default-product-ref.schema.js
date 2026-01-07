import mongoose from 'mongoose'
import { MultiLangNameSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang-name.schema.js'
import { defaultProductsCollection } from '../default-products.constant.js'
import { slugDefObject } from '../../../core/db/mongodb/slug-plugin.js'

export const DefaultProductRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: defaultProductsCollection,
			required: true
		},
		slug: slugDefObject,
		name: { type: MultiLangNameSchema, required: true },
		images: {
			thumbnail: {
				url: { type: String, required: false }
			}
		}
	},
	{ timestamps: { createdAt: false, updatedAt: true } }
)
