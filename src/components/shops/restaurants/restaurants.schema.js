import mongoose from 'mongoose'

export const RestaurantSchema = new mongoose.Schema(
	{
		hasTableService: { type: Boolean, default: true },
		menuCategories: [String]
	},
	{ _id: false }
)
