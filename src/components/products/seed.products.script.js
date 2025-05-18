const mongoose = require('mongoose')
const { ProductModel, productsCollection } = require('./products.schema') // Adjust path to your products model file
const { DefaultProductModel, defaultProductsCollection } = require('../default-products/default-products.schema') // Adjust path to your default-products model file
const { UserModel, usersCollection } = require('../users/users.schema') // Adjust path to your users model file
const config = require(`../../config`)

// MongoDB connection URI (replace with your MongoDB URI)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/drinaluza'

// Sample products data (without defaultProduct and user, which will be assigned dynamically)
const productsData = [
	{
		price: {
			tnd: '45.00',
			eur: '13.50'
		},
		searchTerms: ['premium atlantic salmon', 'salmon atlantique premium', 'سلمون الأطلسي الممتاز', 'fish', 'seafood'],
		isActive: true,
		availability: {
			startDate: new Date('2025-05-01'),
			endDate: new Date('2025-12-31')
		}
	},
	{
		price: {
			tnd: '30.00',
			eur: '9.00'
		},
		searchTerms: ['fresh tunisian shrimp', 'crevette tunisienne fraîche', 'جمبري تونسي طازج', 'prawn', 'seafood'],
		isActive: true,
		availability: {
			startDate: new Date('2025-05-01'),
			endDate: null
		}
	},
	{
		price: {
			tnd: '50.00',
			eur: '15.00'
		},
		searchTerms: ['mediterranean tuna fillet', 'filet de thon méditerranéen', 'شريحة تونة البحر الأبيض', 'fish', 'seafood'],
		isActive: toString(),
		availability: {
			startDate: new Date('2025-05-01'),
			endDate: new Date('2025-11-30')
		}
	},
	{
		price: {
			tnd: '25.00',
			eur: '7.50'
		},
		searchTerms: ['red mullet whole', 'rouget entier', 'بربوني كامل', 'fish', 'seafood'],
		isActive: true,
		availability: {
			startDate: new Date('2025-05-01'),
			endDate: null
		}
	},
	{
		price: {
			tnd: '10.00',
			eur: '3.00'
		},
		searchTerms: ['canned sardines', 'sardines en conserve', 'سردين معلب', 'fish', 'seafood'],
		isActive: true,
		availability: {
			startDate: new Date('2025-05-01'),
			endDate: new Date('2026-05-01')
		}
	},
	{
		price: {
			tnd: '35.00',
			eur: '10.50'
		},
		searchTerms: ['grilled octopus', 'poulpe grillé', 'أخطبوط مشوي', 'cephalopod', 'seafood'],
		isActive: true,
		availability: {
			startDate: new Date('2025-05-01'),
			endDate: new Date('2025-10-31')
		}
	},
	{
		price: {
			tnd: '40.00',
			eur: '12.00'
		},
		searchTerms: ['sea bream fillet', 'filet de dorade', 'شريحة دوراد', 'fish', 'seafood'],
		isActive: true,
		availability: {
			startDate: new Date('2025-05-01'),
			endDate: null
		}
	},
	{
		price: {
			tnd: '20.00',
			eur: '6.00'
		},
		searchTerms: ['steamed mussels', 'moules cuites à la vapeur', 'بلح البحر المطهو بالبخار', 'shellfish', 'seafood'],
		isActive: true,
		availability: {
			startDate: new Date('2025-05-01'),
			endDate: new Date('2025-12-31')
		}
	},
	{
		price: {
			tnd: '28.00',
			eur: '8.40'
		},
		searchTerms: ['cuttlefish ink pasta', 'pâtes à l’encre de seiche', 'معكرونة بحبر الحبار', 'cephalopod', 'seafood'],
		isActive: true,
		availability: {
			startDate: new Date('2025-05-01'),
			endDate: null
		}
	},
	{
		price: {
			tnd: '15.00',
			eur: '4.50'
		},
		searchTerms: ['salted anchovies', 'anchois salés', 'أنشوجة مملحة', 'fish', 'seafood'],
		isActive: true,
		availability: {
			startDate: new Date('2025-05-01'),
			endDate: new Date('2026-05-01')
		}
	}
]

// Function to seed the database
async function seedDatabase() {
	try {
		if (config.NODE_ENV === 'production') {
			console.log('cannot seed in production')
			process.exit(1)
		}
		// Connect to MongoDB
		await mongoose.connect(MONGODB_URI, {})
		console.log('Connected to MongoDB')

		// Fetch default product _ids
		const defaultProducts = await DefaultProductModel.find().limit(10)
		console.log(`Found ${defaultProducts.length} default products`)
		if (defaultProducts.length === 0) {
			throw new Error('No default products found. Please seed default-products first.')
		}

		// Fetch user _ids
		const users = await UserModel.find().limit(10)
		console.log(`Found ${users.length} users`)
		if (users.length === 0) {
			throw new Error('No users found. Please seed users first.')
		}

		// Limit products to the number of available default products
		const productsToInsert = productsData.slice(0, defaultProducts.length).map((product, index) => {
			// Randomly select a user _id
			const user = users[Math.floor(Math.random() * users.length)]
			/*console.log({
				...product,
				defaultProduct: defaultProducts[index],
				user: user
			})*/
			return {
				...product,
				defaultProduct: defaultProducts[index],
				user: user
			}
		})

		console.log(`Attempting to seed ${productsToInsert.length} products`)

		// Insert products without clearing existing data
		await ProductModel.insertMany(productsToInsert, { ordered: false }).catch((err) => {
			console.error(err)
		})
		console.log(`Successfully seeded ${productsToInsert.length} products`)

		// Verify inserted data
		const count = await ProductModel.countDocuments()
		console.log(`Total documents in ${productsCollection}: ${count}`)
	} catch (error) {
		console.error('Error seeding database:', error)
	} finally {
		// Close the MongoDB connection
		await mongoose.connection.close()
		console.log('MongoDB connection closed')
		process.exit(0)
	}
}

// Run the seed function
seedDatabase()
