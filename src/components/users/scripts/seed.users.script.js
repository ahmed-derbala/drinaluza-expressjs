import { createUserSrvc } from '../users.service.js'
import { log } from '../../../core/log/index.js'
import mongoose from 'mongoose'
import config from '../../../config/index.js'
import { createAuthSrvc } from '../../../core/auth/auth.service.js'

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

/**
 * Seed owner users into the database
 */
const processSeed = async () => {
	try {
		log({ message: 'Starting owners seed script...', level: 'info' })

		// Check if owners already exist
		/*	const existingOwners = await UserModel.find({ role: 'shop_owner' }).lean()
	
			if (existingOwners.length > 0) {
				log({ message: 'Owners already exist in the database. Skipping seed.', level: 'warn' })
				return { success: true, message: 'Owners already exist' }
			}*/

		// Create each owner
		for (const ownerData of users) {
			const signedupUser = await createUserSrvc(ownerData)
			await createAuthSrvc({ user: signedupUser, password: ownerData.password })
			log({ message: `Created owner: ${ownerData.slug}`, level: 'info' })
		}

		log({ message: 'Owners seed completed successfully', level: 'success' })
		return { success: true, message: 'Owners seeded successfully' }
	} catch (error) {
		log({
			message: 'Error in owners seed script',
			error: error.message,
			stack: error.stack,
			level: 'error'
		})
		return { success: false, error: error.message }
	}
}

// Function to seed the database
async function seedDatabase() {
	try {
		if (config.NODE_ENV === 'production') throw new Error('Seed script is not allowed to run in production environment')

		// Connect to MongoDB
		await mongoose.connect(config.db.mongodb.uri, {})
		console.log(`Connected to MongoDB: ${config.db.mongodb.uri}`)
		await processSeed()
	} catch (error) {
		console.error('Error seeding database:', error)
	} finally {
		// Close the MongoDB connection
		await mongoose.connection.close()
		console.log('MongoDB connection closed')
	}
}
// Run the seed function
seedDatabase()
