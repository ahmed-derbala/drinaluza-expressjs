import mongoose from 'mongoose'
import validator from 'validator'
import { PhoneSchema } from './phone.schema.js'

export const ContactSchema = new mongoose.Schema(
	{
		phone: {
			type: PhoneSchema,
			required: false
		},
		backupPhones: {
			type: [PhoneSchema],
			required: false
		},
		whatsapp: {
			type: String,
			required: false,
			trim: true,
			sparse: true,
			unique: true
			/*validate: {
				validator: value =>
					!value || validator.isMobilePhone(value, 'any', { strictMode: false }),
				message: 'Invalid WhatsApp number'
			}*/
		},
		email: {
			type: String,
			required: false,
			sparse: true, // avoids unique conflicts on null values
			unique: true,
			lowercase: true,
			trim: true,
			validate: {
				validator: (value) => validator.isEmail(value),
				message: 'Invalid email address'
			}
		},
		website: {
			type: String,
			required: false,
			validate: {
				validator: function (value) {
					return validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true })
				},
				message: (props) => `${props.value} is not a valid URL`
			}
		}
	},
	{ _id: false, timestamps: false, select: false }
)
