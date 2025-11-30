import * as expressValidator from 'express-validator'
const { checkSchema, body, query, oneOf } = expressValidator

export const searchVld = [
	body('text').trim().isString(),
	body('components')
		.trim()
		.isArray()
		.notEmpty()
		.custom((value) => {
			const validComponents = ['products', 'shops', 'users']
			const invalidComponents = value.filter((component) => !validComponents.includes(component))
			if (invalidComponents.length > 0) {
				throw new Error(`Invalid components: ${invalidComponents.join(', ')}`)
			}
			return true
		})
]
