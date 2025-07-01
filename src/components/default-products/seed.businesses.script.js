import mongoose from 'mongoose'
import { BusinessModel } from './businesses.schema.js'
import { UserModel } from '../users/users.schema.js'
import { shopsCollection } from '../shops/shops.schema.js'
async function seedBusinesses() {
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
		// Fetch existing shops
		const shops = await mongoose.model(shopsCollection).find({}).limit(5)
		/* if (shops.length === 0) {
      console.log('No shops found. Please seed shops first.');
      return;
    }*/
		// Sample business data
		const businesses = [
			{
				name: 'Tech Retail Group',
				createdByUser: {
					_id: users[0]._id,
					username: users[0].username
				}
			}
			/*   {
        name: 'Fashion Empire',
        createdByUser: {
          _id: users[1]._id,
          username: users[1].username,
        },
        
      },
      {
        name: 'Gourmet Foods Inc',
        createdByUser: {
          _id: users[2]._id,
          username: users[2].username,
        },
       
      },*/
		]
		// Clear existing businesses
		await BusinessModel.deleteMany({})
		console.log('Cleared existing businesses')
		// Insert new businesses
		await BusinessModel.insertMany(businesses)
		console.log(`Seeded ${businesses.length} businesses successfully`)
		// Disconnect from MongoDB
		await mongoose.disconnect()
		console.log('Disconnected from MongoDB')
	} catch (error) {
		console.error('Error seeding businesses:', error)
		await mongoose.disconnect()
	}
}
// Run the seed function
seedBusinesses()
