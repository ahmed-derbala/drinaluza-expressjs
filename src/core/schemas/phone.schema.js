const mongoose = require('mongoose')

exports.phone = new mongoose.Schema(
	{
		fullNumber: { type: String, required: false },
		countryCode: { type: String, required: false },
		shortNumber: { type: String, required: false }
	},
	{ _id: false, timestamps: true }
)
