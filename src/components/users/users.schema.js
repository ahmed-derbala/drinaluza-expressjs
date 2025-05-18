const mongoose = require('mongoose')
const config = require(`../../config`)
const phoneSchema = require('../../core/schemas/phone.schema')
const addressSchema = require('../../core/schemas/address.schema')
const settingsSchema = require('../../core/schemas/settings.schema')
const profileSchema = require('../../core/schemas/profile.schema')
const enums = require('../../core/enums')

const schema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			default: function () {
				return this._id
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
		name: {
			type: String, //firstName+lastName or username
			required: true,
			default: function () {
				return this.username
			}
		},
		profile: {
			type: profileSchema,
			select: false
		},
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
		settings: {
			type: settingsSchema,
			select: false
		}
	},
	{ timestamps: true }
)

const usersCollection = 'users'

module.exports = {
	UserModel: mongoose.model(usersCollection, schema),
	usersCollection
}
