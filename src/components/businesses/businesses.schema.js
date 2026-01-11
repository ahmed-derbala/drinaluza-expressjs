import mongoose from 'mongoose'
import { ShopRefSchema } from '../shops/schemas/shop-ref.schema.js'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { businessesCollection } from './businesses.constant.js'
import { MultiLangNameSchema } from '../../core/db/mongodb/shared-schemas/multi-lang-name.schema.js'
import { UserRefSchema } from '../users/schemas/user-ref.schema.js'
import { MediaSchema } from '../../core/db/mongodb/shared-schemas/media.schema.js'
const BusinessSchema = new mongoose.Schema(
	{
		shops: [{ type: ShopRefSchema, required: true }],
		owner: { type: UserRefSchema, required: true },
		slug: { type: String, required: true },
		name: MultiLangNameSchema,
		description: { type: String, required: false },
		state: { type: StateSchema, required: true },
		media: MediaSchema
	},
	{ timestamps: true, collection: businessesCollection }
)

BusinessSchema.plugin(slugPlugin, { source: 'name', target: 'slug', sub: 'en' })
//BusinessSchema.index({ slug: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })
export const BusinessModel = mongoose.model(businessesCollection, BusinessSchema)
