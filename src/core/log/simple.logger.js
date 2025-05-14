const clc = require('cli-color')
const config = require(`../../config`)

const simplelogger = ({ level, label, error, message, req, data }) => {
	if (!config.log.isActive || !config.log.levels.allowed.includes(level)) return null

	const levelWidth = 8 // Fixed width for level
	const labelWidth = 10 // Fixed width for label
	const messageWidth = 80 // Fixed width for error
	const errorWidth = 50 // Fixed width for error

	const formattedLevel = level.padEnd(levelWidth)
	const formattedLabel = label.padEnd(labelWidth)
	const formattedMessage = message.padEnd(messageWidth)
	const formattedError = (error || '').padEnd(errorWidth)

	switch (level) {
		case 'error':
			console.error(clc.white.bold.bgRed(level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break

		case 'warn':
			console.warn(clc.yellow(level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break

		case 'info':
			console.log(clc.blue(level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break

		case 'verbose':
			console.info(clc.green(level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break

		case 'debug':
			console.log(clc.white(level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break

		case 'silly':
			console.log(clc.white(level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break

		default:
			console.log(clc.blue(formattedLevel, formattedLabel, formattedMessage, JSON.stringify(req), JSON.stringify(data), formattedError))
	}
}

module.exports = { simplelogger }
