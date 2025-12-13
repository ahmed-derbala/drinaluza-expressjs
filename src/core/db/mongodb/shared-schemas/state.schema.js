import mongoose from 'mongoose'

export const stateEnum = {
	ACTIVE: 'active',
	INACTIVE: 'inactive',
	SUSPENDED: 'suspended',
	ALL: ['active', 'inactive', 'suspended']
}

export const StateSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			enum: stateEnum.ALL,
			default: 'active',
			required: true
		},
		updatedAt: {
			type: Date,
			default: Date.now
		}
	},
	{ _id: false, timestamps: { createdAt: false, updatedAt: true } }
)
