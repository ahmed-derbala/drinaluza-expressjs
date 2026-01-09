import mongoose from 'mongoose'
import { priceUnitEnum } from '../products.enum.js'

export const CurrenciesSchema = new mongoose.Schema(
	{
		tnd: {
			type: Number,
			required: true,
			default: 0,
			min: 0
		},
		eur: {
			type: Number,
			required: false,
			default: null,
			min: 0
		},
		usd: {
			type: Number,
			required: false,
			default: null,
			min: 0
		}
	},
	{ _id: false, timestamps: false }
)

export const PriceSchema = new mongoose.Schema(
	{
		value: CurrenciesSchema,
		unit: {
			measure: {
				type: String,
				required: true,
				enum: priceUnitEnum.values,
				default: priceUnitEnum.KG
			},
			min: {
				//when the seller wants a minimum quantity to sell
				type: Number,
				required: true,
				default: 1,
				min: 1
			}
		}
	},
	{ _id: false, timestamps: true }
)
