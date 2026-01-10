/**
 * Mongoose plugin for intelligent slug generation.
 * @param {Schema} schema
 * @param {Object} options
 * @param {string} [options.source='name'] - The field to slugify (supports string or object).
 * @param {string} [options.target='slug'] - The field to create.
 * @param {string} [options.sub='en'] - The key to use if source is an object.
 * @param {boolean} [options.unique=true] - If true: Throws error on duplicate. If false: Appends -1, -2...
 */
export const slugPlugin = (schema, options = {}) => {
	const { source = 'name', target = 'slug', sub = 'en', unique = true } = options

	// 1. SINGLE SOURCE OF TRUTH: Define the field and index here
	const fieldConfig = {
		type: String,
		trim: true
	}

	if (unique) {
		fieldConfig.unique = true // DB level constraint
	}

	schema.add({ [target]: fieldConfig })

	schema.pre('validate', async function (next) {
		// Only run if the source is modified OR the slug is missing
		if (!this.isModified(source) && this[target]) {
			return next()
		}

		// 2. Extract value (Handles "name" as string or "name: {en: '...'}")
		let rawValue = this.get(source)
		if (rawValue && typeof rawValue === 'object') {
			rawValue = rawValue[sub] || Object.values(rawValue)[0]
		}

		if (!rawValue) return next()

		// 3. Generate Clean Base Slug
		const baseSlug = rawValue
			.toString()
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '') // Remove special chars
			.replace(/[\s_-]+/g, '-') // Spaces/underscores to hyphens
			.replace(/^-+|-+$/g, '') // Trim hyphens from ends

		// 4. Uniqueness Logic
		let currentSlug = baseSlug
		let counter = 0

		while (true) {
			const query = {
				[target]: currentSlug,
				_id: { $ne: this._id }
			}

			// Performance: .select('_id') and .lean() makes the check faster
			const exists = await this.constructor.findOne(query).select('_id').lean()

			if (!exists) {
				this[target] = currentSlug
				break
			}

			// Conflict handling based on "unique" setting
			if (unique) {
				const error = new Error(`Slug "${currentSlug}" already exists.`)
				error.name = 'ValidationError'
				return next(error)
			} else {
				counter++
				currentSlug = `${baseSlug}-${counter}`
			}

			// Infinite loop safety
			if (counter > 100) return next(new Error('Too many slug collisions.'))
		}
		next()
	})
}
