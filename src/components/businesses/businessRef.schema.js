const mongoose = require('mongoose')
const { usersCollection } = require('../users/users.schema')

const BusinessRefSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: [true, 'business._id is required']
		},
		name: { type: String, required: true }
	},
	{ _id: false, timestamps: true }
)

module.exports = {
	BusinessRefSchema
}
