import mongoose from 'mongoose'
import { UserRefSchema } from '../../components/users/schemas/user-ref.schema.js'

const authCollection = 'auth'

const AuthSchema = new mongoose.Schema(
	{
		user: UserRefSchema,
		password: {
			type: String,
			required: true,
			select: false
		}
	},
	{ timestamps: true, collection: authCollection }
)
export const AuthModel = mongoose.model(authCollection, AuthSchema)
