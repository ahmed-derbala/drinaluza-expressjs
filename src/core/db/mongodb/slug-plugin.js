// This file exports a Mongoose plugin function that can be used to
// automatically generate a unique slug for any schema.

export const slugDefObject = {
	type: String,
	required: true
}

/**
 * Mongoose plugin to generate a unique slug from a specified field.
 * @param {Schema} schema The Mongoose schema to apply the plugin to.
 * @param {Object} [options] Options for the plugin.
 * @param {string} [options.source='name'] The field to use for generating the slug.
 * @param {string} [options.target='slug'] The field where the slug will be stored.
 * @param {string} [options.ownerField] The field representing the owner/parent to ensure unique slugs per owner.
 */
export const slugPlugin = (schema, options = {}) => {
	const sourceField = options.source || 'name'
	const targetField = options.target || 'slug'
	const ownerField = options.ownerField
	const sub = options.sub

	// The key change: Using 'pre("validate")' to run before validation.
	schema.pre('validate', async function (next) {
		/*if (!this.isModified(sourceField) && this[targetField]) {
			// If the source field hasn't changed and a slug already exists,
			// we don't need to do anything.
			return next()
		}*/

		// Step 1: Generate the base slug from the source field.
		let baseSlug = this[sourceField]
		if (sub) {
			baseSlug = this[sourceField][sub]
		}
		baseSlug = baseSlug
			.toString()
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '')
			.replace(/--+/g, '-')
			.replace(/^-+/, '')
			.replace(/-+$/, '')

		// Step 2: Check for uniqueness and append a counter if a duplicate exists.
		let count = 0
		let uniqueSlug = baseSlug

		while (true) {
			const query = {
				[targetField]: uniqueSlug,
				_id: { $ne: this._id }
			}

			if (ownerField) {
				query[ownerField] = this[ownerField]
			}

			const existingDoc = await this.constructor.findOne(query)

			if (!existingDoc) {
				this[targetField] = uniqueSlug
				break
			}

			count++
			uniqueSlug = `${baseSlug}-${count}`
		}

		next()
	})
}
