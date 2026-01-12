import mongoose from 'mongoose'
import { AddressSchema } from '../../core/db/mongodb/shared-schemas/address.schema.js'
import { ShopRefSchema } from '../shops/schemas/shop-ref.schema.js'
import { usersCollection } from './users.constant.js'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
import { userRolesEnum } from './users.enum.js'
import { BusinessRefSchema } from '../businesses/schemas/business-ref.schema.js'
import { AuthModel } from '../../core/auth/auth.schema.js'
import { UserSettingsSchema } from './schemas/user-settings.schema.js'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { MultiLangNameSchema } from '../../core/db/mongodb/shared-schemas/multi-lang-name.schema.js'
import { SocialMediaSchema } from '../../core/db/mongodb/shared-schemas/social-media.schema.js'
import { MediaSchema } from '../../core/db/mongodb/shared-schemas/media.schema.js'
import { stateEnum } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { ContactSchema } from '../../core/db/mongodb/shared-schemas/contact.schema.js'
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

const UserSchema = new mongoose.Schema(
	{
		business: { type: BusinessRefSchema, required: false },
		shops: {
			type: [ShopRefSchema],
			required: false,
			select: false
		},
		slug: { type: String, required: true },
		name: MultiLangNameSchema,
		role: {
			type: String,
			enum: userRolesEnum.ALL,
			default: userRolesEnum.CUSTOMER
		},
		contact: {
			type: ContactSchema,
			select: false,
			required: false
		},
		basicInfos: {
			type: UserBasicInfosSchema,
			select: false
		},
		address: {
			type: AddressSchema,
			select: false
		},
		settings: {
			type: UserSettingsSchema,
			select: false
		},
		state: {
			type: StateSchema,
			required: true,
			default: () => ({})
		},
		socialMedia: SocialMediaSchema,
		media: MediaSchema
	},
	{ timestamps: true }
)

UserSchema.post('findOneAndUpdate', async function (doc, next) {
	// 1. Get the update object from the query that was executed
	// 'this' refers to the Mongoose Query object here.
	const update = this.getUpdate()

	// 2. Determine if the 'role' field was part of the update operation.
	// It could be:
	// a) Directly set: { role: 'NEW_ROLE' }
	// b) Set using $set: { $set: { role: 'NEW_ROLE' } }
	const roleWasUpdated = update && (update.role || (update.$set && update.$set.role))

	if (roleWasUpdated) {
		try {
			// 'doc' is the updated User document returned by findOneAndUpdate.
			const newRole = doc.role

			// Update the denormalized role in the Auth collection
			await AuthModel.updateOne({ 'user._id': doc._id }, { $set: { 'user.role': newRole } })

			console.log(`✅ Auth role synchronized for user ${doc._id} after findOneAndUpdate.`)
		} catch (error) {
			console.error(`❌ Error synchronizing Auth role:`, error)
		}
	}
	next()
})
UserSchema.plugin(slugPlugin, { source: 'name', target: 'slug', sub: 'en', unique: true })
export const UserModel = mongoose.model(usersCollection, UserSchema)
