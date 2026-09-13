import fs from 'node:fs'
import path from 'node:path'
import { log } from '#log/log.module.js'

export function syncBarrels(rootDir = path.resolve('src')) {
	const packageJsonPath = path.resolve('package.json')
	let pkg = {}

	try {
		if (fs.existsSync(packageJsonPath)) {
			pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
		}
	} catch (e) {
		// Ignore parse errors or handle gracefully
	}

	pkg.imports = pkg.imports || {}
	let packageModified = false

	const summary = {
		createdBarrels: [],
		recreatedBarrels: [],
		skippedFolders: [],
		addedImports: [],
		removedImports: []
	}

	function scan(dir) {
		const entries = fs.readdirSync(dir, { withFileTypes: true })

		// Step 1: Recursively process subdirectories FIRST (Bottom-Up)
		for (const entry of entries) {
			if (entry.isDirectory()) {
				const fullPath = path.join(dir, entry.name)
				scan(fullPath)
			}
		}

		// Step 2: Process current directory AFTER subdirectories have index.js created
		for (const entry of entries) {
			if (entry.isDirectory()) {
				const fullPath = path.join(dir, entry.name)
				processFolder(fullPath, entry.name)
			}
		}
	}

	function processFolder(folderPath, folderName) {
		const indexPath = path.join(folderPath, 'index.js')
		const hasIndex = fs.existsSync(indexPath)

		if (hasIndex) {
			const content = fs.readFileSync(indexPath, 'utf-8')
			const firstLine = content.split(/\r?\n/)[0]

			if (firstLine === '// BARREL') {
				generateBarrel(folderPath, indexPath)
				summary.recreatedBarrels.push(folderPath)
				updatePackageImports(folderPath, folderName)
			} else {
				summary.skippedFolders.push(folderPath)
				log({
					level: 'warn',
					label: 'BARREL',
					error: null,
					message: `Folder skipped: '${folderPath}' index.js does not start with '// BARREL'`
				})
			}
		} else {
			generateBarrel(folderPath, indexPath)
			summary.createdBarrels.push(folderPath)
			updatePackageImports(folderPath, folderName)
		}
	}

	function generateBarrel(folderPath, indexPath) {
		const files = fs.readdirSync(folderPath, { withFileTypes: true })
		const exportLines = ['// BARREL']

		for (const file of files) {
			if (file.name === 'index.js') continue

			if (file.isFile() && file.name.endsWith('.js')) {
				exportLines.push(`export * from './${file.name}';`)
			} else if (file.isDirectory()) {
				const subIndexPath = path.join(folderPath, file.name, 'index.js')
				if (fs.existsSync(subIndexPath)) {
					exportLines.push(`export * from './${file.name}/index.js';`)
				}
			}
		}

		fs.writeFileSync(indexPath, exportLines.join('\n') + '\n', 'utf-8')
	}

	function updatePackageImports(folderPath, folderName) {
		const relativeSrc = path.relative(path.resolve('.'), folderPath).replace(/\\/g, '/')
		const keyBase = `#${folderName}`
		const keyWildcard = `#${folderName}/*`
		const valBase = `./${relativeSrc}/index.js`
		const valWildcard = `./${relativeSrc}/*.js`

		if (!pkg.imports[keyBase] || !pkg.imports[keyWildcard]) {
			pkg.imports[keyBase] = valBase
			pkg.imports[keyWildcard] = valWildcard
			summary.addedImports.push(keyBase, keyWildcard)
			packageModified = true
		}
	}

	// Remove obsolete entries pointing to missing files or folders
	function pruneObsoleteImports() {
		for (const [key, val] of Object.entries(pkg.imports)) {
			const rawPath = getPathString(val)

			// Normalize path (convert wildcard patterns to folder references for verification)
			const targetPath = rawPath.replace(/\/\*\.js$/, '').replace(/\/\*$/, '')
			const resolvedPath = path.resolve(targetPath)

			if (!fs.existsSync(resolvedPath)) {
				delete pkg.imports[key]
				summary.removedImports.push(key)
				packageModified = true
			}
		}
	}

	// Extract string target path even if value is an object
	function getPathString(val) {
		if (typeof val === 'string') return val
		if (val && typeof val === 'object') {
			const firstVal = Object.values(val)[0]
			return typeof firstVal === 'string' ? firstVal : JSON.stringify(val)
		}
		return String(val)
	}

	function sortImportsByPath(importsObj) {
		return Object.fromEntries(
			Object.entries(importsObj).sort(([, valA], [, valB]) => {
				return getPathString(valA).localeCompare(getPathString(valB))
			})
		)
	}

	if (fs.existsSync(rootDir)) {
		scan(rootDir)
	}

	// Clean obsolete subpaths before sorting
	pruneObsoleteImports()

	// Always sort imports and check if order changed
	if (pkg.imports && Object.keys(pkg.imports).length > 0) {
		const sortedImports = sortImportsByPath(pkg.imports)

		// Check if the order or content actually changed
		if (JSON.stringify(pkg.imports) !== JSON.stringify(sortedImports)) {
			pkg.imports = sortedImports
			packageModified = true
		}
	}

	if (packageModified) {
		fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
	}

	log({
		level: 'info',
		label: 'BARREL',
		error: null,
		message: [
			'Sync Barrels Completed Summary:',
			`- Created barrels: ${summary.createdBarrels.length}`,
			`- Recreated barrels: ${summary.recreatedBarrels.length}`,
			`- Skipped folders: ${summary.skippedFolders.length}`,
			`- Package imports added: ${summary.addedImports.length}`,
			`- Package imports removed: ${summary.removedImports.length}`
		].join('\n')
	})
}

// Auto-run if executed directly via terminal / npm script
if (process.argv[1] && process.argv[1].endsWith('sync-barrels.script.js')) {
	syncBarrels()
}
