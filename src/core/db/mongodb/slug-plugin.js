/**
 * Mongoose plugin for intelligent slug generation with manual override support.
 */
export const slugPlugin = (schema, options = {}) => {
	const { source = 'name', target = 'slug', sub = 'en', unique = true } = options

	// 1. Define the field and index
	const fieldConfig = {
		type: String,
		trim: true
	}

	if (unique) {
		fieldConfig.unique = true
	}

	schema.add({ [target]: fieldConfig })

	schema.pre('validate', async function (next) {
		// --- NEW LOGIC: MANUAL OVERRIDE CHECK ---
		// If a slug is already provided manually on a new document,
		// or if it's being manually updated, we skip generating it from "name".
		if (this.isModified(target) && this[target]) {
			// We still need to check if the manually passed slug is unique
			return await validateUniqueness.call(this, this[target], next)
		}

		// Standard logic: skip if source hasn't changed and slug exists
		if (!this.isModified(source) && this[target]) {
			return next()
		}

		// 2. Extract value
		let rawValue = this.get(source)
		if (rawValue && typeof rawValue === 'object') {
			rawValue = rawValue[sub] || Object.values(rawValue)[0]
		}

		if (!rawValue) return next()

		// 3. Generate Base Slug
		const baseSlug = rawValue
			.toString()
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '')

		// 4. Run the uniqueness loop
		await validateUniqueness.call(this, baseSlug, next)
	})

	/**
	 * Helper function to handle the database lookup loop
	 */
	async function validateUniqueness(baseSlug, next) {
		let currentSlug = baseSlug
		let counter = 0

		while (true) {
			const query = {
				[target]: currentSlug,
				_id: { $ne: this._id }
			}

			const exists = await this.constructor.findOne(query).select('_id').lean()

			if (!exists) {
				this[target] = currentSlug
				break
			}

			if (unique) {
				const error = new Error(`Slug "${currentSlug}" already exists.`)
				error.name = 'ValidationError'
				return next(error)
			} else {
				counter++
				currentSlug = `${baseSlug}-${counter}`
			}

			if (counter > 100) return next(new Error('Too many slug collisions.'))
		}
		next()
	}
}

export const processSlug = (value) => {
	return value
		.toString()
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '') // Remove special chars
		.replace(/[\s_-]+/g, '-') // Spaces/underscores to hyphens
		.replace(/^-+|-+$/g, '') // Trim hyphens from ends
}
