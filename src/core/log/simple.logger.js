import clc from 'cli-color'
import config from '../../config/index.js'

const THEME = {
	error: { primary: clc.red.bold, bg: clc.bgRed.white.bold, symbol: '✖' },
	warn: { primary: clc.yellow, bg: clc.bgYellow.black, symbol: '⚠' },
	info: { primary: clc.cyan, bg: clc.bgCyan.black, symbol: 'ℹ' },
	verbose: { primary: clc.magenta, bg: clc.bgMagenta.black, symbol: '💬' },
	debug: { primary: clc.blackBright, bg: clc.bgWhite.black, symbol: '⚙' },
	default: { primary: clc.blue, bg: clc.bgBlue.white, symbol: '•' }
}

const stringify = (val) => {
	if (!val || (typeof val === 'object' && Object.keys(val).length === 0)) return null
	const str = typeof val === 'string' ? val : JSON.stringify(val, null, 2)
	return str
		.split('\n')
		.map((line) => `  ${line}`)
		.join('\n')
}

/**
 * Helper to extract a display name from a user object or string
 */
const formatUser = (user) => {
	if (!user) return null
	if (typeof user === 'string') return user
	// Try to find a common identifier in the user object
	return user.email || user.id || user.username || 'unknown-user'
}

export const simplelogger = ({ level, label, error, message, req, data, user }) => {
	if (!config.log.isActive || !config.log.levels.allowed.includes(level)) return

	const style = THEME[level] || THEME.default
	const now = new Date()
	const timestamp = clc.blackBright(`${now.toLocaleDateString()} ${now.toLocaleTimeString()}`)

	// 1. Prepare Header Components
	const badge = style.bg(` ${level.toUpperCase()} `)
	const tag = label ? clc.blackBright(`[${label}]`) : ''

	// User Component: Displayed as @username in a distinct color
	const userIdentifier = formatUser(user)
	const userTag = userIdentifier ? clc.magentaBright(` @${userIdentifier} `) : ''

	// 2. Build the Header Line
	const header = `${style.symbol} ${badge} ${timestamp}${userTag} ${tag}`

	// 3. Build the Body (Message, Error, Request, Data)
	const bodyParts = [message, error, req, data]
		.map(stringify)
		.filter(Boolean)
		.join(`\n${clc.blackBright('  ---')}\n`)

	// 4. Final Output
	console.log(`\n${header}`)
	if (bodyParts) {
		console.log(bodyParts)
	}
}
