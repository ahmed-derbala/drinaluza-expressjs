import mongoose from 'mongoose'

export const AddressSchema = new mongoose.Schema(
	{
		street: {
			type: String,
			required: false,
			trim: true
		},
		city: {
			type: String,
			required: false,
			trim: true,
			default: 'El bosten'
		},
		state: {
			type: String,
			required: true,
			trim: true,
			default: 'Sfax'
		},
		postalCode: {
			type: String,
			trim: true
		},
		country: {
			type: String,
			required: true,
			trim: true,
			default: 'Tunisia'
		}
	},
	{ _id: false }
)
