import { ObjectId } from 'mongoose'
export const properties = {
	isActive: {
		type: 'boolean',
		default: true,
		required: true,
		description: 'isActive'
	},
	profile: {
		type: 'object',
		default: {},
		required: true,
		description: 'profile'
	},
	currentValue: {
		type: 'number',
		default: 1,
		required: true,
		description: 'currentValue'
	},
	jobs: {
		type: 'array',
		default: [],
		required: false,
		description: 'jobs'
	},
	email: {
		type: 'string',
		default: 'derbala.ahmed531992@gmail.com',
		required: true,
		description: 'email'
	},
	userId: {
		type: ObjectId,
		default: '64df4241abe7c1f4395b3a65', //to check
		required: true,
		description: 'userId'
	}
}
export default {
	properties
}
