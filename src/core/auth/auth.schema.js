import mongoose from 'mongoose'
import { usersCollection } from '../../components/users/users.constant.js'
import { UserSettingsSchema } from '../../components/users/users.schema.js'
const authCollection = 'auth'
import { userRolesEnum } from '../../components/users/users.enum.js'
const AuthSchema = new mongoose.Schema(
	{
		user: {
			_id: { type: mongoose.Schema.Types.ObjectId, ref: usersCollection, required: true, unique: true },
			email: { type: String /*unique: true*/ },
			slug: { type: String, required: true /*unique: true*/ },
			name: { type: String, required: true },
			role: {
				type: String,
				enum: userRolesEnum.ALL,
				default: userRolesEnum.CUSTOMER
			},
			settings: UserSettingsSchema,
			updatedAt: { type: Date, required: true }
		},
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
export { authCollection }
export default {
	AuthModel,
	authCollection
}
