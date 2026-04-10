export const stateEnum = {
	PENDING: 'pending',
	ACTIVE: 'active',
	INACTIVE: 'inactive',
	SUSPENDED: 'suspended',
	DELETED: 'deleted',
	ALL: ['pending', 'active', 'inactive', 'suspended', 'deleted']
}

export const StateSchema = {
	code: {
		type: String,
		enum: stateEnum.ALL,
		default: stateEnum.ACTIVE,
		required: true
	}
}
