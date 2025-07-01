import fs from 'fs'
import { log } from '../log/index.js'
import path from 'path'
/**
 *
 * @param {string} rootDir sub directory of /src , starts with /
 * @param {string} urlPrefix starts with / and ends with /
 * @param {string} filesSuffix starts with . and ends with .extension
 */
export const load = async ({ app, rootDir, urlPrefix, fileSuffix, hasSubDir = true }) => {
	let endpoint_root,
		files,
		loadedFilesCount = 0

	if (hasSubDir === false) {
		files = fs.readdirSync(`${process.cwd()}/src${rootDir}`)
		if (files.length > 0) {
			for (const file of files) {
				if (file.includes(fileSuffix)) {
					loadedFilesCount++
					endpoint_root = file.substring(0, file.indexOf(fileSuffix))
					app.use(`${urlPrefix}${endpoint_root}`, (await import(`${process.cwd()}/src${rootDir}/${file}`)).default)
					if (endpoint_root === 'index') {
						app.use(`${urlPrefix}`, (await import(`${process.cwd()}/src${rootDir}/${file}`)).default)
					}
				}
			}
		}
		log({ label: 'loader', level: 'info', message: `${loadedFilesCount} ${fileSuffix} routes loaded from ${rootDir}` })
		return
	}
	const baseDir = path.join(process.cwd(), 'src', rootDir)
	const directories = fs.readdirSync(baseDir).filter((name) => {
		const fullPath = path.join(baseDir, name)
		return fs.statSync(fullPath).isDirectory()
	})

	for (const dir of directories) {
		files = fs.readdirSync(`${process.cwd()}/src${rootDir}/${dir}`)
		if (files.length > 0) {
			for (const file of files) {
				if (file.includes(fileSuffix)) {
					loadedFilesCount++
					endpoint_root = file.substring(0, file.indexOf(fileSuffix))
					app.use(`${urlPrefix}${endpoint_root}`, (await import(`${process.cwd()}/src${rootDir}/${dir}/${file}`)).default)
				}
			}
		}
	}
	log({ label: 'loader', level: 'info', message: `${loadedFilesCount} ${fileSuffix} routes loaded from ${rootDir}` })
}

/**
 * require multiple files based on file name suffix
 * @param {*} param0
 */
export const batchRequire = async ({ fileSuffix, rootDir, params, message }) => {
	let loadedFilesCount = 0,
		files
	let directories = fs.readdirSync(`${process.cwd()}/src${rootDir}/`)
	for (const dir of directories) {
		files = fs.readdirSync(`${process.cwd()}/src${rootDir}/${dir}`)
		if (files.length > 0) {
			for (const file of files) {
				if (file.includes(fileSuffix)) {
					loadedFilesCount++
					if (params) {
						;(await import(`${process.cwd()}/src${rootDir}/${dir}/${file}`)).default(params)
					} else {
						await import(`${process.cwd()}/src${rootDir}/${dir}/${file}`)
					}
				}
			}
		}
	}

	if (!message) message = `${loadedFilesCount} ${fileSuffix} files loaded`
	log({ label: 'loader', level: 'info', message })
}
