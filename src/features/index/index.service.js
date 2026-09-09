import { config } from '#config'
export const mainData = () => {
	return {
		header: {
			title: config.app.name
		},
		footer: { author: config.app.author }
	}
}
