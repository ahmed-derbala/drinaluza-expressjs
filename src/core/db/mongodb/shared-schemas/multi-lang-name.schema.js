import mongoose from 'mongoose'

export const MultiLangNameSchema = new mongoose.Schema(
	{
		en: {
			type: String,
			required: true
		},
		tn_en: {
			//tunisian with latin alphabet
			type: String,
			required: true
		},
		tn_ar: {
			//tunisian with arabic alphabet
			type: String,
			required: false
		}
	},
	{ _id: false, timestamps: false }
)
