const mongoose = require('mongoose')
const phoneSchema = require('../../core/shared/schemas/phone.schema')
const addressSchema = require('../../core/shared/schemas/address.schema')

const usersCollection = 'users'
let photo = (exports.photo = new mongoose.Schema(
	{
		url: { type: String, required: false }
	},
	{ _id: false, timestamps: true }
))

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
		username: {
			//by default username is the _id, it can be changed later (once) by the user
			type: String,
			required: true,
			default: function () {
				return this._id
			}
		},
		name: {
			//defaults to firstName+lastName or username. Its displayed name, it can be changed many times by the user
			type: String,
			required: true,
			default: function () {
				return this.username
			}
		},
		email: {
			type: String,
			required: false
			//unique: true // return error if email is null duplicated
		},
		phone: {
			type: phoneSchema,
			select: false,
			required: false
		},
		profile: UserProfileSchema,
		/*role: {
			type: Object,
			enum: config.users.roles,
			default: config.users.roles[0]
		},*/
		/*type: {
			type: Object,
			enum: config.users.types,
			default: config.users.types[0]
		},*/
		isActive: {
			type: Boolean,
			default: true
		},
		address: {
			type: addressSchema,
			select: false
		},
		settings: UserSettingsSchema
	},
	{ timestamps: true }
)

const CreatedByUserSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		name: { type: String, required: true }
	},
	{ _id: false, timestamps: { createdAt: false, updatedAt: true } }
)

module.exports = {
	UserModel: mongoose.model(usersCollection, UserSchema),
	usersCollection,
	UserProfileSchema,
	CreatedByUserSchema,
	UserSchema,
	UserSettingsSchema
}
