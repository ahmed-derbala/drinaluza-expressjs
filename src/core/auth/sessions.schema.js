const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema(
	{
		token: {
			type: String,
			required: true
		},
		user: {
			type: Object,
			ref: 'users',
			required: true
		},
		req: {
			headers: {
				'user-agent': {
					type: Object,
					required: true
				}
			},
			ip: { type: String, required: true }
		}
	},
	{ timestamps: true }
)

schema.plugin(uniqueValidator)

const sessionsCollection = 'sessions'

module.exports = {
	SessionsModel: mongoose.model(sessionsCollection, schema),
	sessionsCollection
}
