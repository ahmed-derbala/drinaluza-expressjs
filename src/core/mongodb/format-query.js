export const formatMongoQuery = (obj, prefix = '') => {
	return Object.keys(obj).reduce((acc, key) => {
		const value = obj[key]
		const newKey = prefix ? `${prefix}.${key}` : key

		const isPlainObject = value !== null && typeof value === 'object' && value.constructor === Object

		// Check if the current object contains any MongoDB operators at top level
		const hasMongoOperator = isPlainObject && Object.keys(value).some((k) => k.startsWith('$'))

		if (isPlainObject && !hasMongoOperator) {
			// Recursively flatten standard nested fields
			Object.assign(acc, formatMongoQuery(value, newKey))
		} else {
			// Keep operators ($in, $gte, etc.), arrays, primitives, and Special BSON as-is
			acc[newKey] = value
		}

		return acc
	}, {})
}
