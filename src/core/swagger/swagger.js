const packagejson = require(`../../../package.json`)
const fs = require('fs')
const ignoreFolders = ['node_modules', 'helpers', '.git', 'config', '.vscode']
const config = require('../../config')

/**
 * load files in a directory based on discriminator
 * @param {*} dirPath
 * @param {*} arrayOfFiles
 * @param {*} discriminator
 * @returns
 */
const getAllFiles = function (dirPath, arrayOfFiles, discriminator) {
	let files = fs.readdirSync(dirPath)
	arrayOfFiles = arrayOfFiles || {}
	let newElem = null

	files.forEach(function (file) {
		if (fs.statSync(dirPath + '/' + file).isDirectory() && !ignoreFolders.includes(file)) {
			arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles, discriminator)
		} else {
			if (file.includes(discriminator)) {
				newElem = require(dirPath + '/' + file)
				arrayOfFiles = { ...arrayOfFiles, ...newElem }
			}
		}
	})

	return arrayOfFiles
}

let paths = getAllFiles(process.cwd(), [], '.path.swagger.js')
let tags = getAllFiles(process.cwd(), [], '.tag.swagger.js')

module.exports = {
	mainDef: {
		swagger: '2.0',
		info: {
			description: packagejson.description,
			version: packagejson.version,
			title: packagejson.name,
			termsOfService: 'http://swagger.io/terms/',
			contact: {
				email: ['ahmed.derbala@esprit.tn', 'mahdi@esprit.tn']
			},
			license: {
				name: 'Apache 2.0',
				url: 'http://server.apache.org/licenses/LICENSE-2.0.html'
			}
		},
		host: `127.0.0.1:${config.backend.port}`,
		basePath: '/',
		tags: Object.values(tags),
		schemes: ['http', 'https'],
		paths: paths,
		securityDefinitions: {
			bearerAuth: {
				type: 'apiKey',
				name: 'authorization',
				scheme: 'bearer',
				in: 'header',
				description: 'please make sure to prefix the token with Bearer. B is uppercase'
			}
		},
		definitions: {}
	}
}
