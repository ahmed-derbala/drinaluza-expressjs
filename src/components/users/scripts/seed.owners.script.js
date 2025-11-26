import { createUserSrvc } from '../users.service.js'
import { log } from '../../../core/log/index.js'
import bcrypt from 'bcrypt'
import { connectMongodb } from '../../../core/db/index.js'
import mongoose from 'mongoose'

// Helper function to generate a slug from a name
const generateSlug = (firstName, lastName) => {
	return `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`
}

// Sample owner data
const owners = [
	{
		email: 'owner1@example.com',
		password: 'password123',
		slug: 'john-doe-123',
		profile: {
			firstName: 'John',
			lastName: 'Doe',
			phone: '+1234567890',
			address: '123 Main St, City, Country'
		},
		role: 'shop_owner',
		isEmailVerified: true,
		isActive: true,
		settings: {
			lang: 'en',
			currency: 'tnd'
		},
		name: 'John Doe' // For backward compatibility with slug plugin
	},
	{
		email: 'owner2@example.com',
		password: 'password123',
		slug: 'jane-smith-456',
		profile: {
			firstName: 'Jane',
			lastName: 'Smith',
			phone: '+1987654321',
			address: '456 Oak Ave, Town, Country'
		},
		role: 'shop_owner',
		isEmailVerified: true,
		isActive: true,
		settings: {
			lang: 'en',
			currency: 'tnd'
		},
		name: 'Jane Smith' // For backward compatibility with slug plugin
	},
	{
		email: 'owner3@example.com',
		password: 'password123',
		slug: 'michael-johnson-789',
		profile: {
			firstName: 'Michael',
			lastName: 'Johnson',
			phone: '+1555123456',
			address: '789 Pine Rd, Village, Country'
		},
		role: 'shop_owner',
		isEmailVerified: true,
		isActive: true,
		settings: {
			lang: 'en',
			currency: 'tnd'
		},
		name: 'Michael Johnson' // For backward compatibility with slug plugin
	}
]

/**
 * Hash a password using bcrypt
 * @param {string} password - The password to hash
 * @returns {Promise<string>} - The hashed password
 */
const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10)
	return await bcrypt.hash(password, salt)
}

/**
 * Seed owner users into the database
 */
export const seedOwners = async () => {
	try {
		log({ message: 'Starting owners seed script...', level: 'info' })

		// Check if owners already exist
		const existingOwners = await mongoose.connection.db.collection('users').find({ role: 'shop_owner' }).toArray()

		if (existingOwners.length > 0) {
			log({ message: 'Owners already exist in the database. Skipping seed.', level: 'warn' })
			return { success: true, message: 'Owners already exist' }
		}

		// Create each owner
		for (const ownerData of owners) {
			const { password, ...ownerWithoutPassword } = ownerData
			const hashedPassword = await hashPassword(password)

			const userData = {
				...ownerWithoutPassword,
				password: hashedPassword,
				// Ensure all required fields are present
				slug: ownerData.slug || generateSlug(ownerData.profile.firstName, ownerData.profile.lastName),
				settings: {
					lang: 'en',
					currency: 'tnd',
					...ownerData.settings
				},
				name: `${ownerData.profile.firstName} ${ownerData.profile.lastName}` // For slug plugin
			}

			await createUserSrvc(userData)

			log({ message: `Created owner: ${ownerData.email}`, level: 'info' })
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

// Run the seed if this file is executed directly
if (process.argv[1] === import.meta.filename) {
	;(async () => {
		try {
			// Use the existing MongoDB connection
			await connectMongodb()
			await seedOwners()
			process.exit(0)
		} catch (error) {
			log({
				message: 'Failed to run owners seed script',
				error: error.message,
				level: 'error'
			})
			process.exit(1)
		} finally {
			// Close the connection when done
			await mongoose.connection.close()
		}
	})()
}
