import mongoose from 'mongoose'
export const CountPeriodSchema = new mongoose.Schema(
	{
		today: { type: Number, default: 0, min: 0 },
		week: { type: Number, default: 0, min: 0 },
		month: { type: Number, default: 0, min: 0 },
		year: { type: Number, default: 0, min: 0 },
		total: { type: Number, default: 0, min: 0 }
	},
	{ _id: false }
)
