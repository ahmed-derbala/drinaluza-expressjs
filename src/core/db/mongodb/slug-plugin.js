/**
 * Mongoose plugin for intelligent slug generation
 * with manual override support and optional uniqueness enforcement.
 */

export const slugPlugin = (schema, options = {}) => {
	const { source = 'name', target = 'slug', sub = 'en', unique = true } = options

	// ------------------------------------------------------------------
	// 1. Define slug field
	// ------------------------------------------------------------------
	const fieldConfig = {
		type: String,
		trim: true
	}

	if (unique) {
		// Note: This creates a MongoDB unique index (not a validator)
		fieldConfig.unique = true
		fieldConfig.sparse = true
	}

	schema.add({ [target]: fieldConfig })

	// ------------------------------------------------------------------
	// 2. Pre-validate hook (Promise style — no next())
	// ------------------------------------------------------------------
	schema.pre('validate', async function () {
		// --- Manual override case ---
		if (this.isModified(target) && this[target]) {
			await validateUniqueness.call(this, this[target])
			return
		}

		// Skip regeneration if source unchanged and slug exists
		if (!this.isModified(source) && this[target]) {
			return
		}

		// Extract raw source value
		let rawValue = this.get(source)

		// Handle i18n object case
		if (rawValue && typeof rawValue === 'object') {
			rawValue = rawValue[sub] || Object.values(rawValue)[0]
		}

		if (!rawValue) return

		const baseSlug = processSlug(rawValue)

		await validateUniqueness.call(this, baseSlug)
	})

	// ------------------------------------------------------------------
	// 3. Uniqueness validator (internal helper)
	// ------------------------------------------------------------------
	async function validateUniqueness(baseSlug) {
		let currentSlug = baseSlug
		let counter = 0

		while (true) {
			const query = {
				[target]: currentSlug,
				_id: { $ne: this._id }
			}

			const exists = await this.constructor.findOne(query).select('_id').lean()

			// If no conflict → assign and exit
			if (!exists) {
				this[target] = currentSlug
				return
			}

			// If strict unique mode → throw immediately
			if (unique) {
				const error = new Error(`Slug "${currentSlug}" already exists.`)
				error.name = 'ValidationError'
				throw error
			}

			// Otherwise append counter
			counter++
			currentSlug = `${baseSlug}-${counter}`

			if (counter > 100) {
				throw new Error('Too many slug collisions.')
			}
		}
	}
}

// ----------------------------------------------------------------------
// Utility: Pure slug processor (can be reused externally)
// ----------------------------------------------------------------------
export const processSlug = (value) => {
	return value
		.toString()
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '') // Remove special characters
		.replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphen
		.replace(/^-+|-+$/g, '') // Trim hyphens
}
