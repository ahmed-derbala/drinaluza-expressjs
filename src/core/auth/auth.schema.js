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
		},
		authType: { type: String, enum: ['email-password', 'google-oauth', 'phone-otp'], default: 'email-password' },
		oauthProvider: String, // e.g., "google"
		oauthId: String, // e.g., Google sub ID
		resetToken: String, // For password reset
		resetExpires: Date,
		lastLogin: Date
	},
	{ timestamps: true, collection: authCollection }
)
export const AuthModel = mongoose.model(authCollection, AuthSchema)
