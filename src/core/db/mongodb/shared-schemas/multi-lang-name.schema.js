import mongoose from 'mongoose'

export const MultiLangNameSchema = new mongoose.Schema(
	{
		en: {
			type: String,
			trim: true,
			required: true
		},
		tn_latn: {
			//tunisian with latin alphabet
			type: String,
			trim: true,
			required: false
		},
		tn_arab: {
			//tunisian with arabic alphabet
			type: String,
			trim: true,
			required: false
		}
	},
	{ _id: false, timestamps: false, required: true }
)
