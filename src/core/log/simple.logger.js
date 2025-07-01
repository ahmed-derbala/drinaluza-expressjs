import clc from 'cli-color'
import config from '../../config/index.js'
const simplelogger = ({ level, label, error, message, req, data }) => {
	if (!config.log.isActive || !config.log.levels.allowed.includes(level)) return null
	const processTime = () => {
		const date = new Date()
		const day = date.getDate()
		const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		const month = monthNames[date.getMonth()]
		const year = date.getFullYear()
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		const seconds = String(date.getSeconds()).padStart(2, '0')
		const formatted = `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`
		return formatted
	}
	const timeWidth = 25 // Fixed width for level
	const levelWidth = 7 // Fixed width for level
	const labelWidth = 10 // Fixed width for label
	const messageWidth = 80 // Fixed width for error
	const errorWidth = 50 // Fixed width for error
	const formattedTime = processTime().padEnd(timeWidth)
	const formattedLevel = level.padEnd(levelWidth)
	const formattedLabel = label?.padEnd(labelWidth)
	const formattedMessage = message.padEnd(messageWidth)
	const formattedError = (JSON.stringify(error) || '').padEnd(errorWidth)
	switch (level) {
		case 'error':
			console.error(clc.white.bold.bgRed(formattedTime, level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break
		case 'warn':
			console.warn(clc.yellow(formattedTime, level, label, JSON.stringify(error), JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break
		case 'info':
			console.log(clc.blue(formattedTime, formattedLevel, formattedLabel, formattedMessage, error, JSON.stringify(req), JSON.stringify(data)))
			break
		case 'verbose':
			console.info(clc.green(formattedTime, level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break
		case 'debug':
			console.log(clc.white(formattedTime, level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break
		case 'silly':
			console.log(clc.white(formattedTime, level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break
		default:
			console.log(clc.blue(formattedTime, formattedLevel, formattedLabel, formattedMessage, JSON.stringify(req), JSON.stringify(data), formattedError))
	}
	console.log()
}
export { simplelogger }
export default {
	simplelogger
}
