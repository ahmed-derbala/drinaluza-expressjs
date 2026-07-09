import mongoose from 'mongoose'

export const AddressSchema = {
	_id: false,
	street: {
		type: String,
		required: false,
		trim: true
	},
	city: {
		type: String,
		required: false,
		trim: true,
		default: 'Ellouza'
	},
	region: {
		type: String,
		required: true,
		trim: true,
		default: 'Sfax'
	},
	country: {
		type: String,
		required: true,
		trim: true,
		default: 'Tunisia'
	},
	postalCode: {
		type: String,
		trim: true,
		default: '3016'
	}
}
