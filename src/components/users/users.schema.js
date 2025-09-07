import mongoose from 'mongoose'
import * as phoneSchema from '../../core/shared/schemas/phone.schema.js'
import * as addressSchema from '../../core/shared/schemas/address.schema.js'
import { ShopRefSchema } from '../shops/schemas/shop-ref.schema.js'
import { usersCollection } from './users.constant.js'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
import { userRolesEnum } from './users.enum.js'

let photo = new mongoose.Schema(
	{
		url: { type: String, required: false }
	},
	{ _id: false, timestamps: true }
)
const UserProfileSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true
		},
		middleName: {
			type: String,
			required: false
		},
		lastName: {
			type: String,
			required: true
		},
		birthDate: {
			type: Date,
			required: false
		},
		photo
	},
	{ _id: false, timestamps: true }
)
const UserSettingsSchema = new mongoose.Schema(
	{
		lang: { type: String, required: true, default: 'en', enum: ['tn_ar', 'tn', 'en'] }, //en, tn, tn_ar
		currency: { type: String, required: true, default: 'tnd', enum: ['tnd', 'eur', 'usd'] } //tnd,eur,usd
	},
	{ _id: false, timestamps: { createdAt: false }, select: false }
)
const UserSchema = new mongoose.Schema(
	{
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		name: {
			//defaults to firstName+lastName or slug. Its displayed name, it can be changed many times by the user
			type: String,
			required: true,
			default: function () {
				return this.slug
			}
		},
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
		profile: UserProfileSchema,
		isActive: {
			type: Boolean,
			default: true
		},
		address: {
			type: addressSchema,
			select: false
		},
		settings: UserSettingsSchema,
		shops: [
			{
				type: ShopRefSchema,
				required: false
			}
		]
	},
	{ timestamps: true }
)
UserSchema.plugin(slugPlugin, { source: 'name', target: 'slug' })
UserSchema.index({ slug: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })
const UserModel = mongoose.model(usersCollection, UserSchema)

export { photo, UserProfileSchema, UserSchema, UserSettingsSchema, UserModel }
