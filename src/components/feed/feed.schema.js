import mongoose from 'mongoose'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'

export const feedCollection = 'feed'

const FeedSchema = new mongoose.Schema(
	{
		targetData: { type: Object, required: true },
		targetResource: {
			type: String,
			enum: ['product', 'shop', 'user'],
			default: 'product',
			required: true
		},
		state: StateSchema,
		card: { kind: { type: String, enum: ['shop', 'product', 'user'], default: 'product', required: true } },
		score: { type: Number, default: 0, select: false }
	},
	{ timestamps: true, collection: feedCollection }
)
export const FeedModel = mongoose.model(feedCollection, FeedSchema)
