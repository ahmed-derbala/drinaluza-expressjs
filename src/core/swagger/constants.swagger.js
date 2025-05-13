const { ObjectId } = require('mongoose')

module.exports = {
	properties: {
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
			default: 'ahmed.derbala@esprit.tn',
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
}
