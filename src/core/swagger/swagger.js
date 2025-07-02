/* eslint-disable no-undef */
import packagejson from '../../../package.json' with { type: 'json' }
import fs from 'fs'
import config from '../../config/index.js'
import path from 'path'
import { pathToFileURL } from 'url'

const ignoreFolders = ['node_modules', 'helpers', '.git', 'config', '.vscode']
/**
 * load files in a directory based on discriminator
 * @param {*} dirPath
 * @param {*} arrayOfFiles
 * @param {*} discriminator
 * @returns
 */
export const getAllFiles = async function (dirPath, arrayOfFiles = {}, discriminator) {
	const files = fs.readdirSync(dirPath)

	for (const file of files) {
		const fullPath = path.join(dirPath, file)
		const stat = fs.statSync(fullPath)

		if (stat.isDirectory() && !ignoreFolders.includes(file)) {
			arrayOfFiles = await getAllFiles(fullPath, arrayOfFiles, discriminator)
		} else if (file.includes(discriminator)) {
			const module = (await import(pathToFileURL(fullPath).href)).default
			const newElem = module.default || module
			arrayOfFiles = { ...arrayOfFiles, ...newElem }
		}
	}

	return arrayOfFiles
}
let paths = await getAllFiles(process.cwd(), [], '.path.swagger.js')
let tags = await getAllFiles(process.cwd(), [], '.tag.swagger.js')

export const mainDef = {
	swagger: '2.0',
	info: {
		description: packagejson.description,
		version: packagejson.version,
		title: packagejson.name,
		termsOfService: 'http://swagger.io/terms/',
		contact: {
			email: ['derbala.ahmed531992@gmail.com', 'mahdi@esprit.tn']
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
export default {
	mainDef
}
