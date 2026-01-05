import { createUserSrvc } from '../users.service.js'
import { log } from '../../../core/log/index.js'
import mongoose from 'mongoose'
import config from '../../../config/index.js'
import { createAuthSrvc } from '../../../core/auth/auth.service.js'

import { fileURLToPath } from 'node:url'
import path from 'node:path'
const __filename = fileURLToPath(import.meta.url)
const scriptFilename = path.basename(__filename)

// Sample owner data
const users = [
	{
		slug: 'so1',
		password: '123',
		profile: {
			firstName: 'John',
			lastName: 'Doe',
			phone: '+1234567890',
			address: '123 Main St, City, Country'
		},
		role: 'shop_owner',
		settings: {
			lang: 'en',
			currency: 'tnd'
		},
		name: 'J o*h    n D-_/o  e' // For backward compatibility with slug plugin
	},
	{
		slug: 'so2',
		password: '123',
		profile: {
			firstName: 'Jane',
			lastName: 'Smith',
			phone: '+1987654321',
			address: '456 Oak Ave, Town, Country'
		},
		role: 'shop_owner',
		settings: {
			lang: 'en',
			currency: 'tnd'
		},
		name: 'Jane Smith' // For backward compatibility with slug plugin
	},
	{
		password: '123',
		slug: 'c1',
		profile: {
			firstName: 'Michael',
			lastName: 'Johnson',
			phone: '+1555123456',
			address: '789 Pine Rd, Village, Country'
		},
		role: 'customer',
		settings: {
			lang: 'en',
			currency: 'tnd'
		},
		name: 'Michael Johnson' // For backward compatibility with slug plugin
	},
	{
		password: '123',
		slug: 'ahmed',
		profile: {
			firstName: 'Michael',
			lastName: 'Johnson',
			phone: '+1555123456',
			address: '789 Pine Rd, Village, Country'
		},
		role: 'customer',
		settings: {
			lang: 'en',
			currency: 'tnd'
		},
		name: 'ahmed' // For backward compatibility with slug plugin
	}
]

const processScript = async () => {
	log({ message: `running ${scriptFilename}`, level: 'info' })
	log({ message: 'Starting users seed script...', level: 'info' })
	// Create each owner
	for (const userData of users) {
		const signedupUser = await createUserSrvc(userData)
		await createAuthSrvc({ user: signedupUser, password: userData.password })
		log({ message: `Created user: ${userData.slug}`, level: 'info' })
	}

	log({ message: 'Owners seed completed successfully', level: 'success' })
	return { success: true, message: 'Owners seeded successfully' }
}

async function run() {
	try {
		if (config.NODE_ENV === 'production') throw new Error('script is not allowed to run in production environment')
		await mongoose.connect(config.db.mongodb.uri, {})
		console.log(`Connected to MongoDB: ${config.db.mongodb.uri}`)
		await processScript()
	} catch (error) {
		console.error('script error:', error)
	} finally {
		await mongoose.connection.close()
		console.log('MongoDB connection closed')
	}
}
run()
