import { MongoClient } from 'mongodb'
import { spawn } from 'node:child_process'
import config from '../../../config/index.js'
console.clear()

if (process.env.NODE_ENV === 'production' && !config.security.allowScriptsInProdution) {
	console.error('❌ Refusing to run: destructive script in production')
	process.exit(1)
}

const MONGO_URI = config.db.mongodb.uri

if (!MONGO_URI?.includes('/drinaluza')) {
	console.error('❌ Safety check failed: MongoDB URI does not target "drinaluza"')
	process.exit(1)
}

/**
 * Drops all collections in the database except for the specified ones.
 * @param {string[]} preservedCollections - Array of collection names to keep (e.g., ['users', 'roles'])
 */
async function dropDatabase(preservedCollections = []) {
	console.log('⚠ Cleaning MongoDB database "drinaluza" (preserving specific collections)...')

	const client = new MongoClient(MONGO_URI)

	try {
		await client.connect()
		const db = client.db()

		// 1. Fetch all existing collections
		const collections = await db.listCollections().toArray()

		// 2. Iterate and drop only if they aren't in the preservation list
		for (const collection of collections) {
			const collectionName = collection.name

			if (preservedCollections.includes(collectionName)) {
				console.log(`- Preserved: ${collectionName}`)
			} else {
				await db.collection(collectionName).drop()
				console.log(`✔ Dropped:   ${collectionName}`)
			}
		}

		console.log('✔ Database cleanup complete!')
	} catch (error) {
		console.error('❌ Error during database cleanup:', error)
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
	'src/features/users/scripts/seed.users.script.js',
	'src/features/businesses/scripts/seed.businesses.script.js',
	'src/features/default-products/scripts/seed.default-products.script.js',
	'src/features/products/scripts/seed.products.script.js'
]

;(async () => {
	try {
		console.clear()
		await dropDatabase()
		//await dropDatabase(['sessions', 'files'])

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
