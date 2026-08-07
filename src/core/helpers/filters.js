import { Types } from 'mongoose'

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
 * Flattens a nested object into a single-level object using dot notation,
 * correctly preserving MongoDB ObjectIds, Dates, and primitive values.
 *
 * @param {object} obj - The object to flatten.
 * @returns {object} The flattened object.
 */
export const flattenObject = (obj) => {
	const result = {}

	function recurse(currentObject, prefix = '') {
		if (currentObject !== null && typeof currentObject === 'object' && !Array.isArray(currentObject)) {
			for (const key in currentObject) {
				if (Object.prototype.hasOwnProperty.call(currentObject, key)) {
					const newKey = prefix ? `${prefix}.${key}` : key
					const value = currentObject[key]

					// Check if value is a plain object (exclude ObjectIds, Dates, etc.)
					const isNestedObject =
						value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && !(value instanceof Types.ObjectId) && value._bsontype !== 'ObjectID' // Fallback check if Mongoose/BSON versions differ

					if (isNestedObject) {
						recurse(value, newKey)
					} else {
						result[newKey] = value
					}
				}
			}
		}
	}

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
