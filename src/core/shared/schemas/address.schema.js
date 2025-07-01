import mongoose from 'mongoose'
import COUNTRIES from '../json/countries.json' with { type: 'json' }
let location = new mongoose.Schema(
	{
		current: {
			lat: { type: String, required: false },
			lon: { type: String, required: false },
			alt: { type: String, required: false }
		},
		last: {
			lat: { type: String, required: false },
			lon: { type: String, required: false },
			alt: { type: String, required: false }
		},
		point: {
			//a fixed location
			lat: { type: String, required: false },
			lon: { type: String, required: false },
			alt: { type: String, required: false }
		}
	},
	{ _id: false, timestamps: true }
)
export const address = new mongoose.Schema(
	{
		text: { type: String, required: false },
		country: { type: String, required: true, default: COUNTRIES.Tunisia.en },
		city: { type: String, required: false },
		street: { type: String, required: false },
		location
	},
	{ _id: false, timestamps: true }
)
export { location }
