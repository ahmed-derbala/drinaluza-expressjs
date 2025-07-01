export const makeAuthKeyQuery = ({ key, kind }) => {
	let authKeyQuery = {}
	switch (kind) {
		case 'email':
			authKeyQuery.email = key
			break
		case 'username':
			authKeyQuery.username = key
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
}
