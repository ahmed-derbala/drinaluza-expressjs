/*
import mongoose from 'mongoose'
import config from '../../../config/index.js'
import {BusinessModel} from '../businesses.schema.js'





const processSeed=async()=>{
    try {
        //find shop_owner users and dont have businesses
        const users = await UserModel.find({role:'shop_owner',business:{ $exists: false }})
    } catch (error) {
        
    }
}




// Function to seed the database
async function seedDatabase() {
    try {
        if(config.NODE_ENV === 'production') throw new Error('Seed script is not allowed to run in production environment')
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
*/
