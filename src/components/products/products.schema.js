const mongoose = require('mongoose')
const config = require(`../../config`)
const enums = require('../../core/enums')

const schema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: false
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
		password: {
			type: String,
			required: true,
			select: false
		},
		profile: {
			type: profileSchema,
			select: false
		},
		role: {
			type: Object,
			enum: config.users.roles,
			default: config.users.roles[0]
		},
		type: {
			type: Object,
			enum: config.users.types,
			default: config.users.types[0]
		},
		isActive: {
			type: Boolean,
			default: true
		},
		jobs: [
			{
				name: {
					type: String,
					enum: enums.jobs.names
				},
				shopId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'shops'
				}
			}
		],
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

const usersCollection = 'products'

module.exports = {
	UsersModel: mongoose.model(usersCollection, schema),
	usersCollection
}
