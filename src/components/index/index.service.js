const config = require(`../../config`)

module.exports.mainData = () => {
	return {
		header: {
			title: config.app.name
		},
		footer: { author: config.app.author }
	}
}
