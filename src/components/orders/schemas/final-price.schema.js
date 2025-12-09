import mongoose from 'mongoose'
import { PriceSchema } from '../../products/schemas/price.schema.js'

export const FinalPriceSchema = new mongoose.Schema(
	{
		...PriceSchema.paths,
		quantity: { type: Number, required: true, default: 1, min: 1 }
	},
	{ _id: false, timestamps: true }
)
