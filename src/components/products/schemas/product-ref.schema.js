import mongoose from 'mongoose'
import { DefaultProductRefSubSchema } from '../../default-products/schemas/default-product-ref.subschema.js'
import { PriceSubSchema } from './price.schema.js'
import { UnitSchema } from './unit.schema.js'
import { productsCollection } from '../products.constant.js'
import { MultiLangSchema } from '../../../core/db/mongodb/shared-schemas/multi-lang.schema.js'
import { MediaThumbnailSchema } from '../../../core/db/mongodb/shared-schemas/media-thumbnail.schema.js'

export const ProductRefSchema = {
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: productsCollection,
		required: true
	},
	defaultProduct: { type: DefaultProductRefSubSchema, required: true },
	name: MultiLangSchema,
	price: { type: PriceSubSchema, required: true },
	unit: { type: UnitSchema, required: true },
	media: { type: MediaThumbnailSchema, required: false }
}
