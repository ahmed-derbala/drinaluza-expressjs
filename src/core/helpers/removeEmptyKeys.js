/**
 * Recursively removes null, undefined, or empty string keys from an object.
 * It also handles circular references to prevent a "Maximum call stack size exceeded" error.
 *
 * @param {object} obj - The object to be cleaned.
 * @param {WeakSet} [seen] - An optional WeakSet to track visited objects for circular reference detection.
 * @returns {object} The cleaned object.
 */
const removeEmptyKeys = (obj, seen = new WeakSet()) => {
	// Check for non-object types or if the object has already been processed
	if (typeof obj !== 'object' || obj === null || seen.has(obj)) {
		return obj
	}

	// Add the current object to the seen set to prevent circular recursion
	seen.add(obj)

	for (let prop in obj) {
		// Check if the property is directly on the object and not from the prototype chain
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			// Remove the key if its value is null, undefined, or an empty string
			if (obj[prop] === null || obj[prop] === undefined || obj[prop] === '') {
				delete obj[prop]
			} else if (typeof obj[prop] === 'object') {
				// Recursively call the function for nested objects
				removeEmptyKeys(obj[prop], seen)

				// If the nested object is now empty, delete its key from the parent object
				if (Object.keys(obj[prop]).length === 0) {
					delete obj[prop]
				}
			}
		}
	}

	// After processing, remove the object from the seen set (optional, but good practice for garbage collection)
	seen.delete(obj)

	return obj
}
export { removeEmptyKeys }
