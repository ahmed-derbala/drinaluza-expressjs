import config from '../../config/index.js'
export const mainData = () => {
	return {
		header: {
			title: config.app.name
		},
		footer: { author: config.app.author }
	}
}
