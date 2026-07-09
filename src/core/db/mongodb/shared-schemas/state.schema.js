import mongoose from 'mongoose'

export const STATES = {
	PENDING: 'pending',
	ACTIVE: 'active',
	SUSPENDED: 'suspended',
	DELETED: 'deleted'
}

const STATES_ALL = Object.freeze(Object.values(STATES))

export const StateSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			enum: STATES_ALL,
			default: STATES.ACTIVE,
			required: true
		}
	},
	{ _id: false, timestamps: true }
)
