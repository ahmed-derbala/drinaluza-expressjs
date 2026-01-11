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
		role: 'shop_owner',
		profile: {
			firstName: 'John',
			lastName: 'Doe',
			phone: '+1234567890',
			address: '123 Main St, City, Country'
		},
		name: { en: 'so1' }
	},
	{
		slug: 'so2',
		password: '123',
		role: 'shop_owner',
		profile: {
			firstName: 'John',
			lastName: 'Doe',
			phone: '+1234567890',
			address: '123 Main St, City, Country'
		},
		name: { en: 'so2' }
	},
	{
		slug: 'c1',
		password: '123',
		role: 'customer',
		profile: {
			firstName: 'c1',
			lastName: 'Doe',
			phone: '+1234567890',
			address: '123 Main St, City, Country'
		},
		name: { en: 'c1' }
	},
	{
		slug: 'c2',
		password: '123',
		role: 'customer',
		profile: {
			firstName: 'c2',
			lastName: 'Doe',
			phone: '+1234567890',
			address: '123 Main St, City, Country'
		},
		name: { en: 'c2' }
	}
]

const processScript = async () => {
	log({ message: `running ${scriptFilename}`, level: 'info' })
	// Create each owner
	for (const userData of users) {
		const signedupUser = await createUserSrvc(userData)
		await createAuthSrvc({ user: signedupUser, password: userData.password })
		log({ message: `Created user: ${userData.slug}`, level: 'info' })
	}
	log({ message: 'Owners seed completed successfully', level: 'success' })
	return true
}

async function run() {
	try {
		//if (config.NODE_ENV === 'production') throw new Error('script is not allowed to run in production environment')
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
