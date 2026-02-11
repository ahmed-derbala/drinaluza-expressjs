import { MongoClient } from 'mongodb'
import { spawn } from 'node:child_process'
import config from '../../config/index.js'
console.clear()

if (process.env.NODE_ENV === 'production') {
	console.error('❌ Refusing to run: destructive script in production')
	process.exit(1)
}

const MONGO_URI = config.db.mongodb.uri

if (!MONGO_URI?.includes('/drinaluza')) {
	console.error('❌ Safety check failed: MongoDB URI does not target "drinaluza"')
	process.exit(1)
}

async function dropDatabase() {
	console.log('⚠ Dropping MongoDB database "drinaluza"')

	const client = new MongoClient(MONGO_URI)

	try {
		await client.connect()

		// Uses DB name from URI (drinaluza)
		const db = client.db()
		await db.dropDatabase()

		console.log('✔ Database "drinaluza" deleted')
	} finally {
		await client.close()
	}
}

function runScript(script) {
	return new Promise((resolve, reject) => {
		const child = spawn('node', [script], { stdio: 'inherit' })

		child.on('close', (code) => {
			code === 0 ? resolve() : reject(new Error(`${script} exited with code ${code}`))
		})
	})
}

const scripts = [
	'src/components/users/scripts/seed.users.script.js',
	'src/components/shops/scripts/seed.shops.script.js',
	'src/components/default-products/scripts/seed.default-products.script.js',
	'src/components/products/scripts/seed.products.script.js'
]

;(async () => {
	try {
		await dropDatabase()

		for (const script of scripts) {
			console.log(`\n▶ Running ${script}`)
			await runScript(script)
		}

		console.log('\n✔ All scripts completed successfully')
	} catch (err) {
		console.error('\n✖ Execution stopped:', err.message)
		process.exit(1)
	}
})()
