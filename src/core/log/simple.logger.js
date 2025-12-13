import clc from 'cli-color'
import config from '../../config/index.js'

/**
 * Helper function to create the log line using a template literal,
 * conditionally including optional data (message, error, req, data).
 */
const createFormattedLog = ({ formattedTime, formattedLevel, formattedLabel, formattedMessage, formattedError, req, data }) => {
	// --- 1. Prepare Conditional Strings ---

	// Stringify and clean up optional objects.
	// We only use the string if it's not '{}' and not '""' (from JSON.stringify(null/undefined)).
	const reqString = (JSON.stringify(req, null, 2) || '').trim()
	const dataString = (JSON.stringify(data, null, 2) || '').trim()
	const errorString = formattedError.trim()
	const messageString = formattedMessage.trim()

	const isReqValid = reqString !== '{}' && reqString !== '""'
	const isDataValid = dataString !== '{}' && dataString !== '""'
	const isErrorValid = errorString && errorString !== 'null' // Check if error exists and is not the string 'null'

	// Build the optional segments
	const messageSegment = messageString ? `${messageString}\n` : ''
	const errorSegment = isErrorValid ? `${errorString}\n` : ''
	const reqSegment = isReqValid ? `${reqString}\n` : ''
	const dataSegment = isDataValid ? `${dataString}` : ''

	// --- 2. Build Final Log String ---

	// Use a template literal to combine all parts.
	// Newlines within the template literal create line breaks in the output.
	return `
${formattedTime.trim()} ${formattedLevel.trim()} ${formattedLabel ? formattedLabel.trim() : ''}
${messageSegment}${errorSegment}${reqSegment}${dataSegment}`
}

export const simplelogger = ({ level, label, error, message, req, data }) => {
	// 1. Logging Config Check
	// Added console.log() back, as it seems you wanted a preceding blank line
	console.log()
	if (!config.log.isActive || !config.log.levels.allowed.includes(level)) {
		return null
	}

	// 2. Formatting Helpers
	const processTime = () => {
		const date = new Date()
		const day = date.getDate()
		const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Au', 'Sep', 'Oct', 'Nov', 'Dec']
		const month = monthNames[date.getMonth()]
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		const seconds = String(date.getSeconds()).padStart(2, '0')
		return `${day} ${month} ${hours}:${minutes}:${seconds}`
	}

	// 3. Applying Padding and Stringification
	const timeWidth = 14
	const levelWidth = 7
	const labelWidth = 10

	const formattedTime = processTime().padEnd(timeWidth)
	const formattedLevel = level.padEnd(levelWidth)
	const formattedLabel = label?.padEnd(labelWidth)

	// Using JSON.stringify() on the non-object fields (message, error) ensures consistency
	// but the output can be 'null' or '""' if the input is null/undefined/empty string.
	const formattedMessage = JSON.stringify(message) || ''
	const formattedError = JSON.stringify(error) || ''

	// 4. Create the formatted log string
	const formattedLog = createFormattedLog({
		formattedTime,
		formattedLevel,
		formattedLabel,
		formattedMessage,
		formattedError,
		req,
		data
	})

	// Initial log of the combined string (for general stdout capture)
	//console.log(formattedLog);

	// 5. Level-Specific Logging
	switch (level) {
		case 'error':
			console.error(clc.white.bold.bgRed(formattedLog))
			break
		case 'warn':
			console.warn(clc.yellow(formattedLog))
			break
		case 'info':
			console.log(clc.blue(formattedLog))
			break
		case 'verbose':
			console.info(clc.green(formattedLog))
			break
		case 'debug':
			console.log(clc.white(formattedLog))
			break
		case 'silly':
			console.log(clc.white(formattedLog))
			break
		default:
			console.log(clc.blue(formattedLog))
	}
}
