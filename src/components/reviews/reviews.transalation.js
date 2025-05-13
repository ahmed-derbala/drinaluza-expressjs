module.exports.ratingNotFoundTrns = ({ lang = 'en' }) => {
	const en = `rating not found`

	switch (lang) {
		case 'en':
			return en

		case 'fr':
			return 'rating non tourvé'

		default:
			return en
	}
}
