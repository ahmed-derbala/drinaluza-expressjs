const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { log } = require(`../../core/log`)
const config = require('../../config')
const { usersCollection } = require('../users/users.schema')
const phoneSchema = require('../../core/schemas/phone.schema')
const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		facebook: {
			username: {
				type: String,
				required: true
			},
			url: {
				type: String,
				required: true
			}
		},
		instagram: {
			username: {
				type: String,
				required: false
			},
			url: {
				type: String,
				required: false
			}
		},
		linkedin: {
			username: {
				type: String,
				required: false
			},
			url: {
				type: String,
				required: false
			}
		},
		web: {
			url: {
				type: String,
				required: false
			}
		},
		phone: {
			type: phoneSchema
		},
		createdBy: {
			//the user who created the reputation
			type: mongoose.Schema.Types.ObjectId,
			ref: usersCollection,
			required: true
		},
		isActive: {
			type: Boolean,
			default: true
		},
		rating: {
			value: {
				type: Number,
				required: false
			},
			ratersCount: {
				type: Number,
				required: false
			},
			updatedAt: {
				type: Date,
				default: Date.now()
			}
		},
		linkedToKind: {
			type: String,
			enum: ['users', 'shops']
		},
		linkedToId: {
			type: mongoose.Schema.Types.ObjectId
		}
	},
	{ timestamps: true }
)

schema.plugin(uniqueValidator)

schema.index({ 'facebook.username': 1 }, { unique: true })

const IdentitiesCollection = 'identities'

const IdentitiesModel = mongoose.model(IdentitiesCollection, schema)
IdentitiesModel.on('index', (error) => {
	if (error) log({ level: config.log.levels.names.error, message: error })
})

module.exports = {
	IdentitiesModel,
	IdentitiesCollection
}
