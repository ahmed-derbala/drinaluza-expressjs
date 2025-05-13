/**
 * do not display null or undefined keys to not waste space
 */

const removeEmptyKeys = (exports.removeEmptyKeys = (obj) => {
	for (let prop in obj) {
		if (obj[prop] === null || obj[prop] === undefined || obj[prop] === '') {
			delete obj[prop]
		} else if (typeof obj[prop] === 'object') {
			removeEmptyKeys(obj[prop])
			if (Object.keys(obj[prop]).length === 0) {
				delete obj[prop]
			}
		}
	}
	return obj
})
