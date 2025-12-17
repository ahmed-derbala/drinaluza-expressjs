import mongoose from 'mongoose'

export const stateEnum = {
	ACTIVE: 'active',
	INACTIVE: 'inactive',
	SUSPENDED: 'suspended',
	DELETED: 'deleted',
	ALL: ['active', 'inactive', 'suspended', 'deleted']
}

export const StateSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			enum: stateEnum.ALL,
			default: 'active',
			required: true
		}
	},
	{ _id: false, timestamps: { createdAt: false, updatedAt: true } }
)
