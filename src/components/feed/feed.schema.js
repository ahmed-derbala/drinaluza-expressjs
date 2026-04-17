import mongoose from 'mongoose'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { usersCollection } from '../users/users.constant.js'
import { shopsCollection } from '../shops/shops.constants.js'
import { productsCollection } from '../products/products.constant.js'

export const feedCollection = 'feed'

const FeedSchema = new mongoose.Schema(
	{
		targetId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			refPath: 'targetResource'
		},
		targetResource: {
			type: String,
			required: true,
			enum: [usersCollection, shopsCollection, productsCollection]
		},
		targetData: {
			type: mongoose.Schema.Types.Mixed,
			required: false
		},
		state: StateSchema,
		card: { kind: { type: String, enum: ['shop', 'product', 'user'], default: 'product', required: true } },
		score: { type: Number, default: 0, select: false }
	},
	{ collection: feedCollection, timestamps: true }
)
export const FeedModel = mongoose.model(feedCollection, FeedSchema)
