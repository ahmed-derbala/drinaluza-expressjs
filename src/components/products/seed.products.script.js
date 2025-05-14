const mongoose = require('mongoose')
const { ProductsModel, productsCollection } = require('./products.schema') // Adjust path to your products model file
const { DefaultProductsModel, defaultProductsCollection } = require('../default-products/default-products.schema') // Adjust path to your default-products model file
const { UsersModel, usersCollection } = require('../users/users.schema') // Adjust path to your users model file

// MongoDB connection URI (replace with your MongoDB URI)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/drinaluza'

// Sample products data (without defaultProduct and user, which will be assigned dynamically)
const productsData = [
	{
		name: {
			en: 'Premium Atlantic Salmon',
			tn: 'Salmon Atlantique Premium',
			tn_ar: 'سلمون الأطلسي الممتاز'
		},
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
		name: {
			en: 'Fresh Tunisian Shrimp',
			tn: 'Crevette Tunisienne Fraîche',
			tn_ar: 'جمبري تونسي طازج'
		},
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
		name: {
			en: 'Mediterranean Tuna Fillet',
			tn: 'Filet de Thon Méditerranéen',
			tn_ar: 'شريحة تونة البحر الأبيض'
		},
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
		name: {
			en: 'Red Mullet Whole',
			tn: 'Rouget Entier',
			tn_ar: 'بربوني كامل'
		},
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
		name: {
			en: 'Canned Sardines',
			tn: 'Sardines en Conserve',
			tn_ar: 'سردين معلب'
		},
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
		name: {
			en: 'Grilled Octopus',
			tn: 'Poulpe Grillé',
			tn_ar: 'أخطبوط مشوي'
		},
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
		name: {
			en: 'Sea Bream Fillet',
			tn: 'Filet de Dorade',
			tn_ar: 'شريحة دوراد'
		},
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
		name: {
			en: 'Steamed Mussels',
			tn: 'Moules Cuites à la Vapeur',
			tn_ar: 'بلح البحر المطهو بالبخار'
		},
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
		name: {
			en: 'Cuttlefish Ink Pasta',
			tn: 'Pâtes à l’Encre de Seiche',
			tn_ar: 'معكرونة بحبر الحبار'
		},
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
		name: {
			en: 'Salted Anchovies',
			tn: 'Anchois Salés',
			tn_ar: 'أنشوجة مملحة'
		},
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
		// Connect to MongoDB
		await mongoose.connect(MONGODB_URI, {})
		console.log('Connected to MongoDB')

		// Fetch default product _ids
		const defaultProducts = await DefaultProductsModel.find().limit(10)
		console.log(`Found ${defaultProducts.length} default products`)
		if (defaultProducts.length === 0) {
			throw new Error('No default products found. Please seed default-products first.')
		}

		// Fetch user _ids
		const users = await UsersModel.find().limit(10)
		console.log(`Found ${users.length} users`)
		if (users.length === 0) {
			throw new Error('No users found. Please seed users first.')
		}

		// Limit products to the number of available default products
		const productsToInsert = productsData.slice(0, defaultProducts.length).map((product, index) => {
			// Randomly select a user _id
			const user = users[Math.floor(Math.random() * users.length)]
			return {
				...product,
				defaultProduct: defaultProducts[index]._id,
				user: user._id
			}
		})

		console.log(`Attempting to seed ${productsToInsert.length} products`)

		// Insert products without clearing existing data
		await ProductsModel.insertMany(productsToInsert, { ordered: false })
		console.log(`Successfully seeded ${productsToInsert.length} products`)

		// Verify inserted data
		const count = await ProductsModel.countDocuments()
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
