const fs = require('fs')

//loading envirment config file if exists
let config,
	configFileName = 'config/default.config.js'
if (process.env.NODE_ENV) {
	const envFilePath = `${process.cwd()}/src/config/${process.env.NODE_ENV}.config.js`
	if (fs.existsSync(envFilePath)) {
		config = require(envFilePath)
		configFileName = `config/${process.env.NODE_ENV}.config.js`
	} else {
		fs.copyFileSync(`${process.cwd()}/src/config/default.config.js`, `${process.cwd()}/src/config/${process.env.NODE_ENV}.config.js`)
	}
} else {
	config = require('./default.config')
}

console.log({ level: 'info', label: 'config', message: `${configFileName} loaded` })
module.exports = { ...config }
