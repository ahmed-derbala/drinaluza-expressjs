export const randomEmail = (domain = 'example.com') => {
	const local = Math.random().toString(36).substring(2, 10)
	return `${local}@${domain}`
}

export const generateTunisianPhone = (options = {}) => {
	const {
		countryCode = false, // include +216
		mobileOnly = true, // restrict to mobile prefixes
		formatted = false // add spacing formatting
	} = options

	// Common valid prefixes in Tunisia
	const mobilePrefixes = [2, 4, 5, 9] // Orange / Ooredoo / TT mobile
	const landlinePrefixes = [7] // landline areas generally start with 7*

	const prefixes = mobileOnly ? mobilePrefixes : [...mobilePrefixes, ...landlinePrefixes]

	const firstDigit = prefixes[Math.floor(Math.random() * prefixes.length)]

	// generate remaining 7 digits
	let rest = ''
	for (let i = 0; i < 7; i++) {
		rest += Math.floor(Math.random() * 10)
	}

	let number = `${firstDigit}${rest}`

	if (formatted) {
		// Example format: 22 345 678
		number = number.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3')
	}

	if (countryCode) {
		number = `+216 ${number}`
	}

	return number
}

// Examples
console.log(generateTunisianPhone())
console.log(generateTunisianPhone({ countryCode: true }))
console.log(generateTunisianPhone({ formatted: true, countryCode: true }))
console.log(generateTunisianPhone({ mobileOnly: false }))
