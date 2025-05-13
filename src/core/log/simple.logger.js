const clc = require('cli-color')



const simplelogger = ({ level, label, error, message, req, data }) => {
	const levelWidth = 10; // Fixed width for level
	const labelWidth = 10; // Fixed width for label
	const messageWidth = 80; // Fixed width for error
	const errorWidth = 50; // Fixed width for error

	const formattedLevel = level.padEnd(levelWidth);
	const formattedLabel = label.padEnd(labelWidth);
	const formattedMessage = message.padEnd(messageWidth);
	const formattedError = (error || '').padEnd(errorWidth);


	switch (level) {
		case 'error':
			console.error(clc.white.bold.bgRed(level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break

		case 'warn':
			console.warn(clc.yellow(level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break

		case 'verbose':
			console.info(clc.green(level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break

		case 'socket':
			console.log(clc.blue(level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break

		case 'debug':
			console.log(clc.white(level, label, error, JSON.stringify(message), JSON.stringify(req), JSON.stringify(data)))
			break

		default:
			console.log(clc.blue(formattedLevel, formattedLabel, formattedMessage, JSON.stringify(req), JSON.stringify(data),formattedError))
	}
}

module.exports = { simplelogger }

