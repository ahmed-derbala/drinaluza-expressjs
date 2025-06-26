const mongoose = require('mongoose')
const { usersCollection } = require('../../components/users/users.schema')
const { UserSettingsSchema } = require('../../components/users/users.schema')
const authCollection = 'auth'

const AuthSchema = new mongoose.Schema(
	{
		user: {
			_id: { type: mongoose.Schema.Types.ObjectId, ref: usersCollection, required: true, unique: true },
			email: { type: String /*unique: true*/ },
			username: { type: String, required: true /*unique: true*/ },
			name: { type: String, required: true },
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

module.exports = {
	AuthModel: mongoose.model(authCollection, AuthSchema),
	authCollection
}
