import mongoose from 'mongoose'

export const AddressSchema = new mongoose.Schema(
	{
		street: {
			type: String,
			trim: true
		},
		city: {
			type: String,
			required: true,
			trim: true
		},
		state: {
			type: String,
			trim: true
		},
		postalCode: {
			type: String,
			trim: true
		},
		country: {
			type: String,
			required: true,
			trim: true
		}
	},
	{ _id: false }
)
