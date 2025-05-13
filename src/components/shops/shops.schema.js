const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const enums = require('../../helpers/enums')
const { log } = require(`../../utils/log`)
const config = require('../../config')
const phoneSchema = require('../../core/schemas/phone.schema')

const ShopsSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: false
		},
		email: {
			type: String,
			required: true,
			unique: false //true
		},
		phone: {
			type: phoneSchema,
			select: false
		},
		category: {
			type: string,
			enum: enums.categories.Shops
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users',
			required: false
		},
		isActive: {
			type: Boolean,
			default: true
		}
	},
	{ timestamps: true }
)

ShopsSchema.plugin(uniqueValidator)

const ShopsSchemaName = 'shops'

const ShopsModel = mongoose.model(ShopsSchemaName, ShopsSchema)
ShopsModel.on('index', (error) => {
	if (error) log({ level: config.log.levelNames.error, message: error })
})

module.exports = {
	ShopsModel,
	ShopsSchemaName
}
