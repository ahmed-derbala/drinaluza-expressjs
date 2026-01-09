import mongoose from 'mongoose'
import { CurrenciesSchema } from '../../products/schemas/price.schema.js'

export const FinalPriceSchema = new mongoose.Schema(
	{
		...CurrenciesSchema.paths
	},
	{ _id: false, timestamps: true }
)
