import mongoose from 'mongoose'

export const AddressSchema = new mongoose.Schema(
	{
		street: {
			type: String,
			trim: true
		},
		city: {
			type: String,
			required: false,
			trim: true,
			default: 'Sfax'
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
			required: false,
			trim: true,
			default: 'Tunisia'
		}
	},
	{ _id: false }
)
