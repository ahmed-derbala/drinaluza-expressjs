import mongoose from 'mongoose'
import { ShopRefSchema } from '../shops/schemas/shop-ref.schema.js'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { OwnerSchema } from '../users/schemas/owner.schema.js'
import { businessesCollection } from './businesses.constant.js'

const BusinessSchema = new mongoose.Schema(
	{
		shops: [{ type: ShopRefSchema, required: true }],
		owner: { type: OwnerSchema, required: true },
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		name: { type: String, required: true },
		description: { type: String, required: false },
		state: { type: StateSchema, required: true }
	},
	{ timestamps: true, collection: businessesCollection }
)

BusinessSchema.plugin(slugPlugin, { source: 'name', target: 'slug' })
BusinessSchema.index({ slug: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })
export const BusinessModel = mongoose.model(businessesCollection, BusinessSchema)
