import mongoose from 'mongoose'
import { PriceSubSchema } from '#schemas/price.subschema.js'

export const PricePeriodSchema = new mongoose.Schema(
	{
		today: { type: PriceSubSchema, default: () => ({}) },
		week: { type: PriceSubSchema, default: () => ({}) },
		month: { type: PriceSubSchema, default: () => ({}) },
		year: { type: PriceSubSchema, default: () => ({}) },
		total: { type: PriceSubSchema, default: () => ({}) }
	},
	{ _id: false }
)
