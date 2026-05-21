import { globSync } from 'glob'
import inquirer from 'inquirer'
import { execSync } from 'child_process'
import config from '../../config/index.js'

async function startMenu() {
	const files = globSync('src/features/**/*.script.js', {
		ignore: 'node_modules/**',
		posix: true
	})

	if (files.length === 0) {
		console.error('❌ No scripts found.')
		process.exit(1)
	}

	const choices = files.map((file) => ({
		name: file.replace('src/features/', ''),
		value: file
	}))

	let keepRunning = true

	while (keepRunning) {
		//console.clear() // Keeps the UI clean
		console.log(`
    💡 NAVIGATION:
    • Enter a NUMBER to select.
    • Press ENTER to confirm.
    • Press CTRL+C to quit.
    `)
		let message = 'Select a script to run:'
		if (config.NODE_ENV === 'production') message = '***** RUNNING ON PRODUCTION ***** \n Select a script to run:'

		const { selectedFile } = await inquirer.prompt([
			{
				type: 'rawlist', // Best for number selection
				name: 'selectedFile',
				message,
				choices: choices,
				pageSize: 9
			}
		])

		console.log(`\n🚀 Executing: node ${selectedFile}\n`)

		try {
			execSync(`node ${selectedFile}`, { stdio: 'inherit' })
			console.log('\n✅ Script completed successfully.')
		} catch (err) {
			console.error('\n❌ Script failed.')
		}

		// Ask to continue or exit
		const { confirm } = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'confirm',
				message: 'Would you like to run another script?',
				default: true
			}
		])

		keepRunning = confirm
	}

	console.log('👋 Goodbye!')
}

startMenu()
