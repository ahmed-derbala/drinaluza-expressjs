const mongoose = require('mongoose')

exports.UserSettingsSchema = new mongoose.Schema(
	{
		lang: { type: String, required: true, default: 'tn_ar', enum: ['tn_ar', 'tn', 'en'] }, //en, tn, tn_ar
		currency: { type: String, required: true, default: 'tnd', enum: ['tnd', 'eur', 'usd'] } //tnd,eur,usd
	},
	{ _id: false, timestamps: true, select: false }
)
