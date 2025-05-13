const mongoose = require('mongoose')

let photo = (exports.photo = new mongoose.Schema(
	{
		url: { type: String, required: false }
	},
	{ _id: false, timestamps: true }
))

exports.profile = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true
		},
		middleName: {
			type: String,
			required: false
		},
		lastName: {
			type: String,
			required: true
		},
		displayName: {
			type: String,
			required: true
		},
		birthDate: {
			type: Date,
			required: false
		},
		photo
	},
	{ _id: false, timestamps: true }
)
