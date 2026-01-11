import mongoose from 'mongoose'
import { AddressSchema } from '../../core/db/mongodb/shared-schemas/address.schema.js'
import { LocationSchema } from '../../core/db/mongodb/shared-schemas/location.schema.js'
import { OwnerSchema } from '../users/schemas/owner.schema.js'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { MultiLangNameSchema } from '../../core/db/mongodb/shared-schemas/multi-lang-name.schema.js'
import { MediaSchema } from '../../core/db/mongodb/shared-schemas/media.schema.js'
export const shopsCollection = 'shops'

const shopSchema = new mongoose.Schema(
	{
		owner: { type: OwnerSchema, required: true },
		slug: { type: String, required: true },
		name: MultiLangNameSchema,
		address: {
			type: AddressSchema
		},
		location: {
			type: LocationSchema
		},
		deliveryRadiusKm: Number,
		state: StateSchema,
		media: MediaSchema
	},
	{ timestamps: true, collection: shopsCollection }
)
shopSchema.plugin(slugPlugin, { source: 'name', target: 'slug', sub: 'en', unique: true })
export const ShopModel = mongoose.model(shopsCollection, shopSchema)
