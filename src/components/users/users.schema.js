import mongoose from 'mongoose'
import * as phoneSchema from '../../core/db/mongodb/shared-schemas/phone.schema.js'
import { AddressSchema } from '../../core/db/mongodb/shared-schemas/address.schema.js'
import { ShopRefSchema } from '../shops/schemas/shop-ref.schema.js'
import { usersCollection } from './users.constant.js'
import { slugDefObject, slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
import { userRolesEnum } from './users.enum.js'
import { BusinessRefSchema } from '../businesses/schemas/business-ref.schema.js'
import { AuthModel } from '../../core/auth/auth.schema.js'
import { UserSettingsSchema } from './schemas/user-settings.schema.js'
import { StateSchema } from '../../core/db/mongodb/shared-schemas/state.schema.js'
import { MultiLangNameSchema } from '../../core/db/mongodb/shared-schemas/multi-lang-name.schema.js'
export const PhotoSchema = new mongoose.Schema(
	{
		url: { type: String, required: false }
	},
	{ _id: false, timestamps: true }
)
export const UserBasicInfosSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		birthDate: {
			type: Date,
			required: false
		},
		photo: PhotoSchema,
		biography: {
			type: String,
			required: false
		}
	},
	{ _id: false, timestamps: true }
)

const UserSchema = new mongoose.Schema(
	{
		business: { type: BusinessRefSchema, required: false },
		shops: [
			{
				type: ShopRefSchema,
				required: false
			}
		],
		slug: slugDefObject,
		name: MultiLangNameSchema,
		/*name: {
			type: String,
			required: true,
			default: function () {
				return this.slug
			}
		},*/
		email: {
			type: String,
			required: false
			//unique: true // return error if email is null duplicated
		},
		role: {
			type: String,
			enum: userRolesEnum.ALL,
			default: userRolesEnum.CUSTOMER
		},
		phone: {
			type: phoneSchema,
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
		state: StateSchema
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
UserSchema.plugin(slugPlugin, { source: 'name', target: 'slug', sub: 'en' })
//UserSchema.index({ slug: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })
export const UserModel = mongoose.model(usersCollection, UserSchema)
