import mongoose from 'mongoose'

export const FinalPriceSchema = new mongoose.Schema(
	{
		value: {
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
		}
	},
	{ _id: false, timestamps: true }
)
