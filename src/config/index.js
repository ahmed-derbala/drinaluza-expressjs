import fs from 'fs'

let config,
	configFileName = 'config/default.config.js'

if (process.env.NODE_ENV) {
	const envFilePath = `${process.cwd()}/src/config/${process.env.NODE_ENV}.config.js`

	if (fs.existsSync(envFilePath)) {
		config = (await import(envFilePath)).default
		configFileName = `config/${process.env.NODE_ENV}.config.js`
	} else {
		fs.copyFileSync(`${process.cwd()}/src/config/default.config.js`, `${process.cwd()}/src/config/${process.env.NODE_ENV}.config.js`)
		config = (await import(envFilePath)).default // Load the newly copied config
	}
} else {
	config = (await import('./default.config.js')).default
}
export default { ...config }
