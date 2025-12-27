import mongoose from 'mongoose'
import config from '../../../config/index.js'
import { UserModel } from '../../users/users.schema.js'
import { ShopModel } from '../shops.schema.js'
import { stateEnum } from '../../../core/db/mongodb/shared-schemas/state.schema.js'

const generateRandomShop = (owner, index) => {
	const shopNames = [
		's1',
		's2',
		's3',
		's4',
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

	const randomName = shopNames[index % shopNames.length]
	const randomCityIndex = Math.floor(Math.random() * cityNames.length)
	const randomState = stateEnum.ALL[index % stateEnum.ALL.length]

	return {
		owner: {
			slug: owner.slug,
			_id: owner._id,
			name: owner.name
		},
		name: randomName,
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
		state: { code: randomState }
	}
}

let manualShops = [
	{
		owner: {},
		name: 'Drinaluza',
		address: {
			street: 'ellouza',
			city: 'Sfax',
			country: 'Tunisia'
		},
		location: {
			type: 'Point',
			coordinates: [10.18, 36.8]
		},
		operatingHours: {
			monday: '9:00 AM - 8:00 PM',
			sunday: 'Closed'
		},
		deliveryRadiusKm: 10,
		state: { code: 'active' }
	}
]

// --- Main Seed Function ---
const seedDatabase = async () => {
	try {
		await mongoose.connect(config.db.mongodb.uri)
		console.log('Successfully connected to MongoDB.')

		// Get existing owners from the users collection
		const owners = await UserModel.find({ role: 'shop_owner' })
		const userAhmed = owners.find((owner) => owner.slug === 'ahmed')

		if (owners.length === 0) {
			console.error('No owners found in the database. Please run the owners seed script first.')
			return
		}

		console.log(`Found ${owners.length} owners in the database.`)

		// Clear existing data to prevent duplicates on re-run
		await ShopModel.deleteMany()
		console.log('Existing shops collection cleared.')

		// Generate shop documents - distribute shops among available owners
		const shopsToInsert = []
		for (let i = 0; i < 10; i++) {
			const owner = owners[i % owners.length] // Cycle through owners
			shopsToInsert.push(generateRandomShop(owner, i))
		}
		manualShops[0].owner = userAhmed
		shopsToInsert.push(...manualShops)
		// Insert the documents
		const result = await ShopModel.insertMany(shopsToInsert)
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
