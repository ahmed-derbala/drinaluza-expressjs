import mongoose from 'mongoose'
import * as phoneSchema from '../../core/db/mongodb/shared-schemas/phone.schema.js'
import { AddressSchema } from '../../core/db/mongodb/shared-schemas/address.schema.js'
import { ShopRefSchema } from '../shops/schemas/shop-ref.schema.js'
import { usersCollection } from './users.constant.js'
import { slugPlugin } from '../../core/db/mongodb/slug-plugin.js'
import { userRolesEnum } from './users.enum.js'

let photoSchema = new mongoose.Schema(
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
		photo: photoSchema,
		biography: {
			type: String,
			required: false
		}
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
		basicInfos: {
			type: UserBasicInfosSchema,
			select: false
		},
		isActive: {
			type: Boolean,
			default: true
		},
		address: {
			type: AddressSchema,
			select: false
		},
		settings: {
			type: UserSettingsSchema,
			select: false
		},
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

export { photoSchema, UserSchema, UserSettingsSchema, UserModel }
