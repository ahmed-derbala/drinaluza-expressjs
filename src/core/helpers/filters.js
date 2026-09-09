export const pickOneFilter = ({ filters }) => {
	const keyWithValue = Object.keys(filters).find((key) => filters[key] !== null && filters[key] !== undefined)
	return { [keyWithValue]: filters[keyWithValue] }
}

export const pickRandom = (array) => array[Math.floor(Math.random() * array.length)]

export const formatUptime = (seconds) => {
	const days = Math.floor(seconds / (24 * 60 * 60))
	seconds %= 24 * 60 * 60

	const hours = Math.floor(seconds / (60 * 60))
	seconds %= 60 * 60

	const minutes = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)

	return `${days} days, ${hours} hours, ${minutes} minutes, ${secs} seconds`
}
