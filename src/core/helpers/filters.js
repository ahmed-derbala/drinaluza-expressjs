export const makeAuthKeyQuery = ({ key, kind }) => {
	let authKeyQuery = {}
	switch (kind) {
		case 'email':
			authKeyQuery.email = key
			break
		case 'slug':
			authKeyQuery.slug = key
			break
		case 'phone':
			authKeyQuery.phone = key
			break
	}
	return authKeyQuery
}
export const pickOneFilter = ({ filters }) => {
	const keyWithValue = Object.keys(filters).find((key) => filters[key] !== null && filters[key] !== undefined)
	return { [keyWithValue]: filters[keyWithValue] }
}
/*
//old
export const flattenObject = ({ obj, parentKey = '', result = {} }) => {
	for (let key in obj) {
		if (!obj.hasOwnProperty(key)) continue
		const newKey = parentKey ? `${parentKey}.${key}` : key
		if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
			flattenObject(obj[key], newKey, result)
		} else {
			result[newKey] = obj[key]
		}
	}
	return result
}*/

/**
 * Flattens a nested object into a single-level object
 * with keys representing the original nested paths using dot notation.
 *
 * This function handles nested objects but leaves primitive values and arrays as they are.
 * It's particularly useful for preparing data to be stored in a database or a flat structure.
 *
 * @param {object} obj - The object to flatten.
 * @returns {object} The flattened object.
 */
export const flattenObject = (obj) => {
	const result = {}

	/**
	 * Recursive helper function to traverse the object.
	 * @param {any} currentObject - The current part of the object being processed.
	 * @param {string} [prefix=''] - The prefix for the new key (e.g., 'owner').
	 */
	function recurse(currentObject, prefix = '') {
		// Check if the current value is an object and not null or an array.
		if (currentObject !== null && typeof currentObject === 'object' && !Array.isArray(currentObject)) {
			for (const key in currentObject) {
				// Ensure the property is directly on the object and not from its prototype chain.
				if (Object.prototype.hasOwnProperty.call(currentObject, key)) {
					// Construct the new key path. Add a dot if a prefix already exists.
					const newKey = prefix ? `${prefix}.${key}` : key
					const value = currentObject[key]

					// If the value is also an object, recurse deeper.
					// Otherwise, it's a primitive value, so we add it to our result.
					if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
						recurse(value, newKey)
					} else {
						result[newKey] = value
					}
				}
			}
		} else {
			// If the initial object is not an object, return an empty object or handle it differently.
			// For this specific use case, we'll just handle valid objects.
		}
	}

	// Start the recursion with the provided object and an empty prefix.
	recurse(obj)

	return result
}

export const pickRandom = (array) => array[Math.floor(Math.random() * array.length)]

export const formatUptime = (seconds) => {
	const days = Math.floor(seconds / (24 * 60 * 60))
	seconds %= 24 * 60 * 60

	const hours = Math.floor(seconds / (60 * 60))
	seconds %= 60 * 60

	const minutes = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)

	return `${days} days, ${hours} hours, ${minutes} minutes, ${secs} seconds`
}
