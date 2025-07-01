import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
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
export const SessionsModel = mongoose.model(sessionsCollection, schema)
export { sessionsCollection }
export default {
	SessionsModel,
	sessionsCollection
}
