import mongoose from 'mongoose'

export const stateEnum = {
	PENDING: 'pending',
	ACTIVE: 'active',
	INACTIVE: 'inactive',
	SUSPENDED: 'suspended',
	DELETED: 'deleted',
	AVAILABLE: 'available',
	OCCUPIED: 'occupied',
	CANCELLED: 'cancelled',
	REJECTED: 'rejected',
	APPROVED: 'approved',
	RESERVED: 'reserved',
	ALL: ['pending', 'active', 'inactive', 'suspended', 'deleted', 'available', 'occupied', 'cancelled', 'rejected', 'approved', 'reserved']
}

export const StateSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			enum: stateEnum.ALL,
			default: stateEnum.ACTIVE,
			required: true
		}
	},
	{ timestamps: true }
)
