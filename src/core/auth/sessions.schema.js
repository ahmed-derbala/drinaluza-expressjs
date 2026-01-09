import mongoose from 'mongoose'
import { UserRefSchema } from '../../components/users/schemas/user-ref.schema.js'

export const sessionsCollection = 'sessions'

const schema = new mongoose.Schema(
	{
		token: {
			type: String,
			required: true
		},
		user: UserRefSchema,
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
	{ timestamps: true, collection: sessionsCollection }
)

export const SessionsModel = mongoose.model(sessionsCollection, schema)
