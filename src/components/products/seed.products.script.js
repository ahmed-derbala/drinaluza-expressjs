// seed-products.js
import mongoose from 'mongoose'
import { ProductModel } from './products.schema.js' // adjust path if needed

// MongoDB connection
const MONGO_URI = 'mongodb://127.0.0.1:27017/drinaluza'

const seedProducts = async () => {
	try {
		await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
		console.log('✅ Connected to MongoDB')

		// Sample seafood products
		const products = [
			{ name: 'Dorade', price: { value: { tnd: 25 }, unit: { name: 'KG', min: 1 } }, searchTerms: ['fish', 'dorade'], stock: { quantity: 50, minThreshold: 5 } },
			{ name: 'Loup de mer', price: { value: { tnd: 32 }, unit: { name: 'KG', min: 1 } }, searchTerms: ['fish', 'sea bass'], stock: { quantity: 40, minThreshold: 5 } },
			{ name: 'Sardines', price: { value: { tnd: 12 }, unit: { name: 'KG', min: 1 } }, searchTerms: ['fish', 'sardine'], stock: { quantity: 100, minThreshold: 10 } },
			{ name: 'Crevettes', price: { value: { tnd: 48 }, unit: { name: 'KG', min: 1 } }, searchTerms: ['shrimp', 'prawn'], stock: { quantity: 30, minThreshold: 5 } },
			{ name: 'Calamar', price: { value: { tnd: 40 }, unit: { name: 'KG', min: 1 } }, searchTerms: ['squid', 'calamari'], stock: { quantity: 25, minThreshold: 5 } },
			{ name: 'Moules', price: { value: { tnd: 18 }, unit: { name: 'KG', min: 1 } }, searchTerms: ['mussels'], stock: { quantity: 60, minThreshold: 10 } },
			{ name: 'Thon', price: { value: { tnd: 55 }, unit: { name: 'KG', min: 1 } }, searchTerms: ['tuna'], stock: { quantity: 20, minThreshold: 3 } },
			{ name: 'Seiche', price: { value: { tnd: 38 }, unit: { name: 'KG', min: 1 } }, searchTerms: ['cuttlefish'], stock: { quantity: 15, minThreshold: 2 } },
			{ name: 'Rouget', price: { value: { tnd: 28 }, unit: { name: 'KG', min: 1 } }, searchTerms: ['red mullet'], stock: { quantity: 35, minThreshold: 5 } },
			{ name: 'Huitres', price: { value: { tnd: 70 }, unit: { name: 'KG', min: 1 } }, searchTerms: ['oyster'], stock: { quantity: 10, minThreshold: 2 } }
		].map((p) => ({
			...p,
			owner: { _id: new mongoose.Types.ObjectId(), name: 'Seeder Script' },
			photos: [],
			isActive: true,
			availability: { startDate: new Date(), endDate: null }
		}))

		// Insert new data
		await ProductModel.insertMany(products)
		console.log('✅ 10 seafood products seeded successfully')

		process.exit(0)
	} catch (error) {
		console.error('❌ Error seeding products:', error)
		process.exit(1)
	}
}

seedProducts()
