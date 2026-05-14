import mongoose from 'mongoose'
import { AddressSchema } from '../../core/db/mongodb/shared-schemas/address.schema.js'
import { LocationSchema } from '../../core/db/mongodb/shared-schemas/location.schema.js'
import { OwnerSchema } from '../users/schemas/owner.schema.js'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { MultiLangSchema } from '../../core/db/mongodb/shared-schemas/multi-lang.schema.js'
import { MediaSchema } from '../../core/db/mongodb/shared-schemas/media.schema.js'
import { ContactSchema } from '../../core/db/mongodb/shared-schemas/contact.schema.js'
import { RatingSubschema } from '../reviews/subschemas/rating.subschema.js'
import { FeedModel } from '../feed/feed.schema.js'
import { SHOP_KINDS, shopsCollection } from './shops.constant.js'
import { RestaurantSchema } from './restaurants/restaurants.schema.js'

const shopSchema = new mongoose.Schema(
	{
		owner: { type: OwnerSchema, required: true },
		slug: { type: String, required: true },
		name: MultiLangSchema,
		address: {
			type: AddressSchema
		},
		location: LocationSchema,
		deliveryRadiusKm: Number,
		state: StateSchema,
		media: { type: MediaSchema, required: false, default: () => ({}) },
		contact: ContactSchema,
		rating: { type: RatingSubschema, required: false, _id: false },
		kind: { type: String, enum: SHOP_KINDS.ALL, required: true, default: SHOP_KINDS.RESTAURANT }
	},
	{ timestamps: true, collection: shopsCollection, discriminatorKey: 'kind' }
)

shopSchema.discriminator(SHOP_KINDS.RESTAURANT, RestaurantSchema)

shopSchema.discriminator(
	SHOP_KINDS.SEAFOOD_MARKET,
	new mongoose.Schema({
		appointmentSlots: [Date],
		services: [{ name: String, duration: Number }]
	})
)

shopSchema.plugin(slugPlugin, { source: 'name', target: 'slug', sub: 'en', unique: true })

// Post-hook for findOneAndUpdate
shopSchema.post('findOneAndUpdate', async function (doc) {
	// doc is the updated shop because you use returnDocument: 'after'
	if (!doc) return

	try {
		// Update all feeds associated with this shop
		await FeedModel.updateMany(
			{
				targetId: doc._id,
				targetResource: shopsCollection
			},
			{
				$set: {
					'targetData.rating': doc.rating
				}
			}
		)
	} catch (error) {
		// Log error but don't necessarily crash the process
		// depending on your error handling strategy
		console.error('Failed to sync Shop rating to Feed:', error)
	}
})
export const ShopModel = mongoose.model(shopsCollection, shopSchema)
