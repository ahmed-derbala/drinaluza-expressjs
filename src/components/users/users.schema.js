const mongoose = require('mongoose')
const phoneSchema = require('../../core/schemas/phone.schema')
const addressSchema = require('../../core/schemas/address.schema')
const { UserSettingsSchema } = require('./userSettings.schema')

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
const schema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			default: function () {
				return this._id
			}
		},
		name: {
			type: String, //firstName+lastName or username
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
		username: { type: String, required: true }
	},
	{ _id: false, timestamps: true }
)

const OrderedByUserSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		name: { type: String, required: true },
		phone: { type: String, required: false },
		address: { type: String, required: false }
	},
	{ _id: false, timestamps: true, required: true }
)

module.exports = {
	UserModel: mongoose.model(usersCollection, schema),
	usersCollection,
	UserProfileSchema,
	CreatedByUserSchema,
	OrderedByUserSchema
}
