const { IdentitiesModel } = require(`./identities.schema`)
const { errorHandler } = require('../../core/utils/error')
const { log } = require('../../core/log')
const { getidentitiesRepo, findOneIdentityRepo, createIdentityRepo } = require('./identities.repository')

module.exports.getidentitiesSrvc = async ({ page, limit, searchText }) => {
	try {
		const identities = await getidentitiesRepo({ page, limit, searchText })
		return identities
	} catch (err) {
		return errorHandler({ err })
	}
}

module.exports.getUseridentitiesrvc = async ({ userId }) => {
	try {
		const data = await IdentitiesModel.findOne({ userId }).lean()
		let status = 200
		if (!data) status = 204
		return { status, data }
	} catch (err) {
		errorHandler({ err })
	}
}

function extractFacebookUsername(url) {
	// Regular expression to match Facebook URLs with usernames or IDs
	const usernameRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([A-Za-z0-9.]+)/i
	const idRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/profile\.php\?id=(\d+)/i

	// Check for profile.php?id= pattern first
	const idMatch = url.match(idRegex)
	if (idMatch) {
		return idMatch[1] // Return only the numerical ID
	}

	// If no ID, check for username pattern
	const usernameMatch = url.match(usernameRegex)
	if (usernameMatch) {
		return usernameMatch[1] // Return the username
	}

	return null // Return null if no valid username or ID is found
}

module.exports.createIdentitySrvc = async ({ name, facebook, rating, createdBy }) => {
	try {
		if (!facebook.username) facebook.username = extractFacebookUsername(facebook.url)
		const identity = await createIdentityRepo({ name, facebook, rating, createdBy })
		return identity
	} catch (err) {
		errorHandler({ err })
	}
}

module.exports.updateRatingSrvc = async ({ reputationId, rating }) => {
	const fetchedReputation = await IdentitiesModel.findOne({
		_id: reputationId
	}).lean()
	if (!fetchedReputation) {
		log({
			level: 'error',
			message: `[identities.service.updateRating] no reputation found with _id ${reputationId}`
		})
		return null
	}

	rating.ratersCount = fetchedReputation.rating.ratersCount++
	rating.currentValue = (fetchedReputation.rating.currentValue + rating.currentValue) / rating.ratersCount

	return IdentitiesModel.updateOne({ _id: reputationId }, { rating })
		.then((updatedReputaion) => {
			return updatedReputaion
		})
		.catch((err) => errorHandler({ err }))
}

function makeQueryObjectFilter(obj) {
	// Check if the input is a valid object
	if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
		return obj
	}

	// Create a new object to hold the transformed result
	const result = {}

	// Iterate through the keys of the input object
	for (const key in obj) {
		if (typeof obj[key] === 'object' && obj[key] !== null) {
			// Get the nested key and value
			const nestedKey = Object.keys(obj[key])[0]
			result[`${key}.${nestedKey}`] = obj[key][nestedKey]
		} else {
			// Directly copy non-object properties
			result[key] = obj[key]
		}
	}

	return result
}

function isObjectEmpty(obj) {
	if (typeof obj !== 'object' || obj === null) {
		return false // Not an object
	}

	// If object is empty at the top level
	if (Object.keys(obj).length === 0) {
		return true
	}

	// Check for nested objects
	for (const key in obj) {
		const value = obj[key]

		if (typeof value === 'object' && value !== null) {
			// Recursively check if the nested object is empty
			if (!isObjectEmpty(value)) {
				return false // Found a nested object that is not empty
			}
		} else {
			// If any non-object property exists, the object is not empty
			return false
		}
	}

	// All properties were either empty or nested empty objects
	return true
}

function checkAndReturn(obj) {
	return isObjectEmpty(obj) ? null : obj
}

module.exports.findOneIdentitySrvc = async ({ match, select }) => {
	try {
		if (!checkAndReturn(match)) return null
		const processedMatch = makeQueryObjectFilter(match)
		const identity = await findOneIdentityRepo({ match: processedMatch, select })
		return identity
	} catch (err) {
		return errorHandler({ err })
	}
}
