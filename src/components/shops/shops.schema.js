import mongoose from 'mongoose'
import { AddressSchema } from '../../core/db/mongodb/shared-schemas/address.schema.js'
import { LocationSchema } from '../../core/db/mongodb/shared-schemas/location.schema.js'
import { OwnerSchema } from '../users/schemas/owner.schema.js'
import { slugDefObject, slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { MultiLangNameSchema } from '../../core/db/mongodb/shared-schemas/multi-lang-name.schema.js'

export const shopsCollection = 'shops'

const shopSchema = new mongoose.Schema(
	{
		owner: { type: OwnerSchema, required: true },
		slug: slugDefObject,
		name: MultiLangNameSchema,
		address: {
			type: AddressSchema
		},
		location: {
			type: LocationSchema
		},
		deliveryRadiusKm: Number,
		state: StateSchema
	},
	{ timestamps: true, collection: shopsCollection }
)
shopSchema.plugin(slugPlugin, { source: 'name', target: 'slug', sub: 'en' })
shopSchema.index({ owner: 1, slug: 1 }, { unique: true })
//Define a case-insensitive unique index
shopSchema.index({ slug: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })
export const ShopModel = mongoose.model(shopsCollection, shopSchema)
