import mongoose from 'mongoose'
import { AuthorSubschema } from '../users/schemas/author.subschema.js'
import { usersCollection } from '../users/users.constant.js'
import { shopsCollection } from '../shops/shops.constants.js'
import { productsCollection } from '../products/products.schema.js'

export const reviewsCollection = 'reviews'

const ReviewSchema = new mongoose.Schema(
	{
		stars: { type: Number, required: true, min: 1, max: 5 },
		comment: { type: String, trim: true },
		author: { type: AuthorSubschema, required: false },
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
		}
	},
	{ timestamps: true, collection: reviewsCollection }
)

export const ReviewModel = mongoose.model(reviewsCollection, ReviewSchema)
