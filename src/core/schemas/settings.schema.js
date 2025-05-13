const mongoose = require('mongoose')

let settings = (exports.settings = new mongoose.Schema(
	{
		lang: { type: String, required: true, default: 'en' } //en, fr, ar ... 2 letters code
	},
	{ _id: false, timestamps: true }
))
