const mongoose = require('mongoose')
const { usersCollection } = require('../../components/users/users.schema')

exports.shopRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		name: { type: String, required: true }
	},
	{ _id: false, timestamps: true }
)
