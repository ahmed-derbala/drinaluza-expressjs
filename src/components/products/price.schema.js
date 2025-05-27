const mongoose = require('mongoose')

exports.PriceSchema = new mongoose.Schema(
	{
		tnd: {
			type: Number,
			required: false,
			default: 0,
			min: 0
		},
		eur: {
			type: Number,
			required: false,
			default: 0,
			min: 0
		},
		usd: {
			type: Number,
			required: false,
			default: 0,
			min: 0
		}
	},
	{ _id: false, timestamps: true }
)
