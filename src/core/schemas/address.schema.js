const mongoose = require('mongoose')

let location = (exports.location = new mongoose.Schema(
	{
		lat: { type: String, required: false },
		lon: { type: String, required: false },
		alt: { type: String, required: false }
	},
	{ _id: false, timestamps: true }
))

exports.address = new mongoose.Schema(
	{
		text: { type: String, required: false },
		country: { type: String, required: false },
		city: { type: String, required: false },
		street: { type: String, required: false },
		location
	},
	{ _id: false, timestamps: true }
)
