export const formatMongoQuery = (obj, prefix = '') => {
	// Return {} if input is falsy, not an object, or an array
	if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
		return {}
	}

	return Object.keys(obj).reduce((acc, key) => {
		const value = obj[key]
		const newKey = prefix ? `${prefix}.${key}` : key

		const isPlainObject = value !== null && typeof value === 'object' && value.constructor === Object

		// Check if the target object contains any MongoDB operators at its top level
		const hasMongoOperator = isPlainObject && Object.keys(value).some((k) => k.startsWith('$'))

		if (isPlainObject && !hasMongoOperator) {
			// Recursively flatten standard nested fields
			Object.assign(acc, formatMongoQuery(value, newKey))
		} else if (isPlainObject && hasMongoOperator) {
			// Recurse into operator objects to flatten any nested document fields inside operators (e.g. $or, $elemMatch)
			acc[newKey] = Object.keys(value).reduce((opAcc, opKey) => {
				const opVal = value[opKey]
				if (opKey.startsWith('$') && Array.isArray(opVal)) {
					// For logical arrays like $or / $and, format each inner object query
					opAcc[opKey] = opVal.map((item) => (typeof item === 'object' && item !== null && item.constructor === Object ? formatMongoQuery(item) : item))
				} else {
					opAcc[opKey] = opVal
				}
				return opAcc
			}, {})
		} else {
			// Keep primitives, arrays, BSON types, etc.
			acc[newKey] = value
		}

		return acc
	}, {})
}
