import mongoose from 'mongoose'
import { DefaultProductRefSchema } from '../../default-products/schemas/default-product-ref.schema.js'
import { PriceSchema } from './price.schema.js'
import { UnitSchema } from './unit.schema.js'
import { productsCollection } from '../products.schema.js'
import { MultiLangSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang.schema.js'
import { MediaThumbnailSchema } from '../../../core/db/mongodb/shared-schemas/media-thumbnail.schema.js'

export const ProductRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: productsCollection,
			required: true
		},
		defaultProduct: { type: DefaultProductRefSchema, required: true },
		name: MultiLangSchema,
		price: { type: PriceSchema, required: true },
		unit: { type: UnitSchema, required: true },
		media: { type: MediaThumbnailSchema, required: false }
	},
	{ timestamps: { createdAt: false, updatedAt: true } }
)
