import mongoose from 'mongoose'
import { AddressSchema } from '#core'

export const SpecsSchema = {
	_id: false,
	caliber: {
		//tiny, small, medium, large, huge
		type: Number,
		required: true,
		enum: [1, 2, 3, 4, 5],
		default: 3,
		min: 1,
		max: 5
	},
	origin: AddressSchema,
	harvest: {
		type: String,
		enum: ['wild', 'farm'],
		default: 'wild'
	},
	gear: {
		type: String,
		enum: ['trap', 'gillnet'],
		default: 'trap'
	}
}
