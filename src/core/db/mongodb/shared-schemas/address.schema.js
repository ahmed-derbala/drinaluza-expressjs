import mongoose from 'mongoose'

export const AddressSchema = {
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
	region: {
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
}
