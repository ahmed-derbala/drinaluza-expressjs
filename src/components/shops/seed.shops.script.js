const mongoose = require('mongoose')
const { ShopModel, shopsCollection } = require('./shops.schema')
const { BusinessModel } = require('../businesses/businesses.schema') // Assuming businesses schema is in this path
const { UserModel } = require('../users/users.schema') // Assuming a UserModel exists

async function seedShops() {
	try {
		// Connect to MongoDB
		await mongoose.connect('mongodb://localhost:27017/drinaluza', {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		console.log('Connected to MongoDB')

		// Fetch existing users
		const users = await UserModel.find({}).limit(3)
		if (users.length === 0) {
			console.log('No users found. Please seed users first.')
			return
		}

		// Fetch existing businesses
		const businesses = await BusinessModel.find({}).limit(3)
		if (businesses.length === 0) {
			console.log('No businesses found. Please seed businesses first.')
			return
		}

		// Sample shop data
		const shops = [
			{
				createdByUser: {
					_id: users[0]._id,
					username: users[0].username
				},
				business: {
					_id: businesses[0]._id,
					name: businesses[0].name
				},
				name: 'Tech Gadget Store',
				location: {
					type: 'Point',
					coordinates: [-122.4194, 37.7749] // Example: San Francisco
				},
				address: {
					street: '123 Market St',
					city: 'San Francisco',
					state: 'CA',
					postalCode: '94103',
					country: 'USA'
				},
				operatingHours: {
					monday: { open: '09:00', close: '18:00' },
					tuesday: { open: '09:00', close: '18:00' },
					wednesday: { open: '09:00', close: '18:00' },
					thursday: { open: '09:00', close: '18:00' },
					friday: { open: '09:00', close: '20:00' },
					saturday: { open: '10:00', close: '20:00' },
					sunday: { open: '11:00', close: '17:00' }
				},
				deliveryRadiusKm: 5,
				isActive: true
			}
			/* {
        createdByUser: {
          _id: users[1]._id,
          username: users[1].username,
        },
        business: {
          _id: businesses[1]._id,
          name: businesses[1].name,
        },
        name: 'Fashion Boutique',
        location: {
          type: 'Point',
          coordinates: [-74.0060, 40.7128], // Example: New York
        },
        address: {
          street: '456 5th Ave',
          city: 'New York',
          state: 'NY',
          postalCode: '10018',
          country: 'USA',
        },
        operatingHours: {
          monday: { open: '10:00', close: '19:00' },
          tuesday: { open: '10:00', close: '19:00' },
          wednesday: { open: '10:00', close: '19:00' },
          thursday: { open: '10:00', close: '19:00' },
          friday: { open: '10:00', close: '20:00' },
          saturday: { open: '11:00', close: '20:00' },
          sunday: { closed: true },
        },
        deliveryRadiusKm: 3,
        isActive: true,
      },
      {
        createdByUser: {
          _id: users[2]._id,
          username: users[2].username,
        },
        business: {
          _id: businesses[2]._id,
          name: businesses[2].name,
        },
        name: 'Gourmet Market',
        location: {
          type: 'Point',
          coordinates: [-87.6298, 41.8781], // Example: Chicago
        },
        address: {
          street: '789 Michigan Ave',
          city: 'Chicago',
          state: 'IL',
          postalCode: '60611',
          country: 'USA',
        },
        operatingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '23:00' },
          saturday: { open: '08:00', close: '23:00' },
          sunday: { open: '09:00', close: '21:00' },
        },
        deliveryRadiusKm: 7,
        isActive: false,
      },*/
		]

		// Clear existing shops
		await ShopModel.deleteMany({})
		console.log('Cleared existing shops')

		// Insert new shops
		await ShopModel.insertMany(shops)
		console.log(`Seeded ${shops.length} shops successfully`)

		// Disconnect from MongoDB
		await mongoose.disconnect()
		console.log('Disconnected from MongoDB')
	} catch (error) {
		console.error('Error seeding shops:', error)
		await mongoose.disconnect()
	}
}

// Run the seed function
seedShops()
