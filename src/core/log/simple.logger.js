const LOG_COLORS = {
	error: '\x1b[30m\x1b[41m', // black text, red BG
	warn: '\x1b[30m\x1b[43m', // black text, yellow BG
	info: '\x1b[30m\x1b[44m', // black text, blue BG
	verbose: '\x1b[30m\x1b[42m', // black text, green BG
	debug: '\x1b[37m', // white text
	silly: '\x1b[32m' // green text
}

const RESET = '\x1b[0m'
const DIM = '\x1b[2m'

export const simplelogger = ({ level = 'info', label, error, message, request, response, data }) => {
	console.log()
	const color = LOG_COLORS[level] || RESET
	const timestamp = new Date().toISOString()

	// Header: [TIMESTAMP] LEVEL (LABEL)
	const levelBadge = `${color} ${level.toUpperCase()} ${RESET}`
	const labelText = label ? `${DIM}[${label}]${RESET} ` : ''

	console.log(`${DIM}${timestamp}${RESET} ${levelBadge} ${labelText}${message || ''}`)

	// Formatted detail sections
	if (error) {
		console.error(`  ${LOG_COLORS.error} ERROR ${RESET}`, error.stack || error)
	}
	if (request) {
		console.log(`  ${DIM}Request:${RESET}`, request)
	}
	if (response) {
		console.log(`  ${DIM}Response:${RESET}`, response)
	}
	if (data) {
		console.log(`  ${DIM}Data:${RESET}`, data)
	}
}
