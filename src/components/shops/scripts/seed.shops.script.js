// This script connects to a local MongoDB database and seeds the 'shops' collection
// with 10 documents representing seafood shops located in Tunisia.

import mongoose from 'mongoose'

// --- Database Configuration ---
const dbName = 'drinaluza'
const dbUri = `mongodb://127.0.0.1:27017/${dbName}`

// --- Schema Definitions (from user's prompt) ---

// Defining a simple OwnerSchema since it was not provided in the prompt.
const OwnerSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	slug: { type: String, required: true },
	name: { type: String, required: true }
})

const AddressSchema = new mongoose.Schema(
	{
		street: {
			type: String,
			trim: true
		},
		city: {
			type: String,
			required: true,
			trim: true
		},
		state: {
			type: String,
			trim: true
		},
		postalCode: {
			type: String,
			trim: true
		},
		country: {
			type: String,
			required: true,
			trim: true
		}
	},
	{ _id: false }
)

const LocationSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ['Point'],
			required: true,
			default: 'Point'
		},
		coordinates: {
			type: [Number],
			required: true,
			validate: {
				validator: function (value) {
					return value.length === 2
				},
				message: 'Coordinates must be an array of [longitude, latitude].'
			}
		}
	},
	{ _id: false }
)

const shopsCollection = 'shops'
const shopSchema = new mongoose.Schema(
	{
		owner: { type: OwnerSchema, required: true },
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		name: {
			type: String,
			required: true,
			trim: true
		},
		address: {
			type: AddressSchema
		},
		location: {
			type: LocationSchema
		},
		operatingHours: {},
		deliveryRadiusKm: Number,
		isActive: { type: Boolean, default: true }
	},
	{ timestamps: true, collection: shopsCollection }
)

// Define the Mongoose models
const Shop = mongoose.model('Shop', shopSchema)

// --- Data Generation Function ---
const generateRandomShop = (index) => {
	const shopNames = [
		'The Seafood Shack',
		"Neptune's Bounty",
		"Ocean's Catch Fish Market",
		'Coastal Crab & Lobster',
		"Sailor's Seafood Grill",
		'The Oyster Bar',
		'Fresh Fish & Co.',
		'Aqua Harvest',
		"Poseidon's Platter",
		'The Gilded Clam',
		'Coral Cove',
		"Triton's Treasure",
		'Lighthouse Seafood',
		'The Catch of the Day',
		'Deep Blue Deli'
	]
	// Updated cities to be in Tunisia
	const cityNames = ['Sfax', 'Tunis', 'Sousse', 'Djerba', 'Hammamet']
	// Set the country to Tunisia for all shops
	const country = 'Tunisia'
	const longitudeRange = [8.5, 11.5] // Approx. longitude range for Tunisia
	const latitudeRange = [33.5, 37.5] // Approx. latitude range for Tunisia

	const randomName = shopNames[Math.floor(Math.random() * shopNames.length)]
	const randomCityIndex = Math.floor(Math.random() * cityNames.length)

	return {
		owner: {
			slug: `ahmed`,
			_id: `68c2deaf655126fda906c7a7`,
			name: `ahmed`
		},
		name: randomName,
		slug: randomName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
		address: {
			street: `Main Street ${Math.floor(Math.random() * 1000) + 1}`,
			city: cityNames[randomCityIndex],
			country: country
		},
		location: {
			type: 'Point',
			coordinates: [
				parseFloat((Math.random() * (longitudeRange[1] - longitudeRange[0]) + longitudeRange[0]).toFixed(4)),
				parseFloat((Math.random() * (latitudeRange[1] - latitudeRange[0]) + latitudeRange[0]).toFixed(4))
			]
		},
		operatingHours: {
			monday: '9:00 AM - 5:00 PM',
			sunday: 'Closed'
		},
		deliveryRadiusKm: Math.floor(Math.random() * 20) + 5, // 5-25 km
		isActive: true
	}
}

// --- Main Seed Function ---
const seedDatabase = async () => {
	try {
		await mongoose.connect(dbUri)
		console.log('Successfully connected to MongoDB.')

		// Clear existing data to prevent duplicates on re-run
		await Shop.deleteMany({})
		console.log('Existing shops collection cleared.')

		// Generate 10 shop documents
		const shopsToInsert = []
		for (let i = 0; i < 10; i++) {
			shopsToInsert.push(generateRandomShop(i))
		}

		// Insert the documents
		const result = await Shop.insertMany(shopsToInsert)
		console.log(`Successfully inserted ${result.length} documents into the 'shops' collection.`)
	} catch (error) {
		console.error('Error seeding the database:', error)
	} finally {
		// Disconnect from the database
		await mongoose.disconnect()
		console.log('Disconnected from MongoDB.')
	}
}

// Execute the seeding process only if not in a production environment
if (process.env.NODE_ENV !== 'production') {
	seedDatabase()
} else {
	console.log("Script is not running because NODE_ENV is set to 'production'.")
}
