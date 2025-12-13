import mongoose from 'mongoose'

export const UserSettingsSchema = new mongoose.Schema(
	{
		lang: { type: String, required: true, default: 'en', enum: ['tn_ar', 'tn', 'en'] }, //en, tn, tn_ar
		currency: { type: String, required: true, default: 'tnd', enum: ['tnd', 'eur', 'usd'] } //tnd,eur,usd
	},
	{ _id: false, timestamps: { createdAt: false }, select: false }
)
