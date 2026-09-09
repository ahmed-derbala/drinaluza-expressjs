import mongoose from 'mongoose'
import { AddressSchema } from '#schemas/address.schema.js'
import { usersCollection } from './users.constant.js'
import { slugPlugin } from '#slug'
import { USER_ROLES, USER_ROLES_ALL } from '#users/users.constant.js'
import { AuthModel } from '../../core/auth/auth.schema.js'
import { UserSettingsSchema } from './schemas/user-settings.schema.js'
import { StateSchema } from '#schemas/state.schema.js'
import { MultiLangSchema } from '#schemas/multi-lang.schema.js'
import { SocialMediaSchema } from '#schemas/social-media.schema.js'
import { MediaSchema } from '#schemas/media.schema.js'
import { ContactSchema } from '#schemas/contact.schema.js'
import { LocationSchema } from '#schemas/location.schema.js'

export const UserBasicInfosSchema = new mongoose.Schema(
	{
		birthDate: {
			type: Date,
			required: false
		},
		biography: {
			type: String,
			required: false
		}
	},
	{ _id: false }
)

const UserSchema = new mongoose.Schema({
	slug: { type: String, required: true },
	name: { type: MultiLangSchema, required: true },
	roles: {
		type: [String],
		enum: USER_ROLES_ALL,
		default: USER_ROLES.customer,
		required: true
	},
	contact: {
		type: ContactSchema,
		select: false,
		required: false
	},
	address: {
		type: AddressSchema,
		select: false,
		required: false
	},
	location: {
		type: LocationSchema,
		required: false,
		default: undefined
	}, // 👈 CRITICAL: Prevents Mongoose from creating an empty object {}
	settings: {
		type: UserSettingsSchema,
		select: false
	},
	media: MediaSchema,
	socialMedia: SocialMediaSchema,
	basicInfos: {
		type: UserBasicInfosSchema,
		select: false
	},
	state: {
		type: StateSchema,
		required: true,
		default: () => ({})
	}
})

UserSchema.post('findOneAndUpdate', async function (doc, next) {
	// 1. Get the update object from the query that was executed
	// 'this' refers to the Mongoose Query object here.
	const update = this.getUpdate()

	// 2. Determine if the 'roles' field was part of the update operation.
	// It could be:
	// a) Directly set: { roles: 'NEW_ROLE' }
	// b) Set using $set: { $set: { roles: 'NEW_ROLE' } }
	const rolesWasUpdated = update && (update.roles || (update.$set && update.$set.roles))

	if (rolesWasUpdated) {
		try {
			// 'doc' is the updated User document returned by findOneAndUpdate.
			const newRole = doc.roles

			// Update the denormalized roles in the Auth collection
			await AuthModel.updateOne({ 'user._id': doc._id }, { $set: { 'user.roles': newRole } })

			console.log(`✅ Auth roles synchronized for user ${doc._id} after findOneAndUpdate.`)
		} catch (error) {
			console.error(`❌ Error synchronizing Auth roles:`, error)
		}
	}
	next()
})

UserSchema.plugin(slugPlugin, { source: 'name', target: 'slug', sub: 'en', unique: true })
export const UserModel = mongoose.model(usersCollection, UserSchema)
