const mongoose = require('mongoose')

exports.price = new mongoose.Schema(
	{
		tnd: { type: Number, required: false },
		eur: { type: Number, required: false },
		usd: { type: Number, required: false }
	},
	{ _id: false, timestamps: true }
)
