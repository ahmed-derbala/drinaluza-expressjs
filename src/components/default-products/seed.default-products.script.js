const mongoose = require('mongoose')
const { DefaultProductModel, defaultProductsCollection } = require('./default-products.schema') // Adjust path to your model file

// MongoDB connection URI (replace with your MongoDB URI)
const MONGODB_URI = 'mongodb://localhost:27017/drinaluza'

// Sample seafood products data
const seafoodProducts = [
	{
		name: {
			en: 'Atlantic Salmon',
			tn: 'Salmon Atlantique',
			tn_ar: 'سلمون الأطلسي'
		},
		searchKeywords: ['atlantic salmon', 'salmon atlantique', 'سلمون الأطلسي', 'fish', 'seafood'],
		isActive: true
	},
	{
		name: {
			en: 'Tunisian Shrimp',
			tn: 'Crevette Tunisienne',
			tn_ar: 'جمبري تونسي'
		},
		searchKeywords: ['tunisian shrimp', 'crevette tunisienne', 'جمبري تونسي', 'prawn', 'seafood'],
		isActive: true
	},
	{
		name: {
			en: 'Mediterranean Tuna',
			tnreadme: 'Thon Méditerranéen',
			tn_ar: 'تونة البحر الأبيض'
		},
		searchKeywords: ['mediterranean tuna', 'thon méditerranéen', 'تونة البحر الأبيض', 'fish', 'seafood'],
		isActive: true
	},
	{
		name: {
			en: 'Red Mullet',
			tn: 'Rouget',
			tn_ar: 'بربوني'
		},
		searchKeywords: ['red mullet', 'rouget', 'بربوني', 'fish', 'seafood'],
		isActive: true
	},
	{
		name: {
			en: 'Sardines',
			tn: 'Sardines',
			tn_ar: 'سردين'
		},
		searchKeywords: ['sardines', 'سردين', 'fish', 'seafood', 'canned'],
		isActive: true
	},
	{
		name: {
			en: 'Octopus',
			tn: 'Poulpe',
			tn_ar: 'أخطبوط'
		},
		searchKeywords: ['octopus', 'poulpe', 'أخطبوط', 'cephalopod', 'seafood'],
		isActive: true
	},
	{
		name: {
			en: 'Sea Bream',
			tn: 'Dorade',
			tn_ar: 'دوراد'
		},
		searchKeywords: ['sea bream', 'dorade', 'دوراد', 'fish', 'seafood'],
		isActive: true
	},
	{
		name: {
			en: 'Mussels',
			tn: 'Moules',
			tn_ar: 'بلح البحر'
		},
		searchKeywords: ['mussels', 'moules', 'بلح البحر', 'shellfish', 'seafood'],
		isActive: true
	},
	{
		name: {
			en: 'Cuttlefish',
			tn: 'Seiche',
			tn_ar: 'حبار'
		},
		searchKeywords: ['cuttlefish', 'seiche', 'حبار', 'cephalopod', 'seafood'],
		isActive: true
	},
	{
		name: {
			en: 'Anchovies',
			tn: 'Anchois',
			tn_ar: 'أنشوجة'
		},
		searchKeywords: ['anchovies', 'anchois', 'أنشوجة', 'fish', 'seafood'],
		isActive: true
	}
]

// Function to seed the database
async function seedDatabase() {
	try {
		// Connect to MongoDB
		await mongoose.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		console.log('Connected to MongoDB')

		// Insert seafood products without clearing existing data
		await DefaultProductModel.insertMany(seafoodProducts, { ordered: false })
		console.log(`Successfully seeded ${seafoodProducts.length} seafood products`)

		// Verify inserted data
		const count = await DefaultProductModel.countDocuments()
		console.log(`Total documents in ${defaultProductsCollection}: ${count}`)
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
