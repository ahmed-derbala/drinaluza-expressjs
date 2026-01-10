import mongoose from 'mongoose'

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
	{ _id: false, timestamps: { createdAt: false, updatedAt: true } }
)

export const PriceSchema = new mongoose.Schema(
	{
		subtotal: { type: CurrenciesSchema, required: false },
		discount: Number,
		tax: Number,
		shipping: Number,
		total: { type: CurrenciesSchema, required: true } // final payable amount
	},
	{ _id: false, timestamps: { createdAt: false, updatedAt: true } }
)
