/**
 * this script seeds default seafood products into the database
 */

import mongoose from 'mongoose'
import { DefaultProductModel } from '../default-products.schema.js'
import { defaultProductsCollection } from '../default-products.constant.js'
import config from '../../../config/index.js'

const seafoodProducts = [
	{
		name: { en: 'Atlantic Salmon', tn_en: 'Salmon', tn_ar: 'سلمون' },
		searchKeywords: ['atlantic salmon', 'salmon', 'سلمون', 'fish', 'seafood']
	},
	{
		name: { en: 'Tunisian Shrimp', tn_en: 'Crevet', tn_ar: 'قمرون' },
		searchKeywords: ['shrimp', 'crevet', 'crevette', 'قمرون', 'جمبري', 'prawn', 'seafood']
	},
	{
		name: { en: 'Sea Bream', tn_en: 'Spares', tn_ar: 'شرغو' },
		searchKeywords: ['sea bream', 'spares', 'sparus', 'شرغو', 'fish', 'seafood']
	},
	{
		name: { en: 'Sea Bass', tn_en: 'Loups', tn_ar: 'وراطة' },
		searchKeywords: ['sea bass', 'loup de mer', 'loups', 'وراطة', 'fish', 'seafood']
	},
	{
		name: { en: 'Sardines', tn_en: 'Sardina', tn_ar: 'سردينة' },
		searchKeywords: ['sardine', 'sardina', 'سردينة', 'oily fish', 'seafood']
	},
	{
		name: { en: 'Octopus', tn_en: 'Garnit', tn_ar: 'قرنيط' },
		searchKeywords: ['octopus', 'garnit', 'قرنيط', 'cephalopod', 'seafood']
	},
	{
		name: { en: 'Squid', tn_en: 'Calamar', tn_ar: 'كلمار' },
		searchKeywords: ['squid', 'calamar', 'كلمار', 'cephalopod', 'seafood']
	},
	{
		name: { en: 'Cuttlefish', tn_en: 'Sebbite', tn_ar: 'سبّيط' },
		searchKeywords: ['cuttlefish', 'sebbite', 'sepia', 'سبّيط', 'seafood']
	},
	{
		name: { en: 'Bluefin Tuna', tn_en: 'Thon', tn_ar: 'تونة' },
		searchKeywords: ['tuna', 'bluefin tuna', 'thon', 'تونة', 'fish', 'seafood']
	},
	{
		name: { en: 'Mussels', tn_en: 'Moules', tn_ar: 'محار' },
		searchKeywords: ['mussels', 'moules', 'محار', 'shellfish', 'seafood']
	},
	{
		name: { en: 'Clams', tn_en: 'Palourde', tn_ar: 'بلاميطا' },
		searchKeywords: ['clams', 'palourde', 'بلاميطا', 'shellfish', 'seafood']
	},
	{
		name: { en: 'Oysters', tn_en: 'Huitres', tn_ar: 'محار صَدَفي' },
		searchKeywords: ['oysters', 'huitres', 'محار', 'shellfish', 'seafood']
	},
	{
		name: { en: 'Red Mullet', tn_en: 'Trilia', tn_ar: 'بربوني' },
		searchKeywords: ['red mullet', 'trilia', 'بربوني', 'fish', 'seafood']
	},
	{
		name: { en: 'Anchovies', tn_en: 'Anchois', tn_ar: 'أنشوفة' },
		searchKeywords: ['anchovies', 'anchois', 'أنشوفة', 'small fish', 'seafood']
	},
	{
		name: { en: 'Mackerel', tn_en: 'Maquereau', tn_ar: 'سكمبري' },
		searchKeywords: ['mackerel', 'maquereau', 'سكمبري', 'oily fish', 'seafood']
	},
	{
		name: { en: 'Crab', tn_en: 'Crabe', tn_ar: 'سلطعون' },
		searchKeywords: ['crab', 'crabe', 'سلطعون', 'shellfish', 'seafood']
	},
	{
		name: { en: 'Lobster', tn_en: 'Homard', tn_ar: 'كركند' },
		searchKeywords: ['lobster', 'homard', 'كركند', 'shellfish', 'seafood']
	},
	{
		name: { en: 'Gilthead Bream', tn_en: 'Dorade', tn_ar: 'دوراد' },
		searchKeywords: ['dorade', 'gilthead bream', 'دوراد', 'fish', 'seafood']
	},
	{
		name: { en: 'Swordfish', tn_en: 'Espadon', tn_ar: 'سمك أبو سيف' },
		searchKeywords: ['swordfish', 'espadon', 'أبو سيف', 'fish', 'seafood']
	},
	{
		name: { en: 'Eel', tn_en: 'Anguille', tn_ar: 'حنكليس' },
		searchKeywords: ['eel', 'anguille', 'حنكليس', 'fish', 'seafood']
	}
]

// Function to seed the database
async function seedDatabase() {
	try {
		// Connect to MongoDB
		await mongoose.connect(config.db.mongodb.uri, {})
		console.log(`Connected to MongoDB: ${config.db.mongodb.uri}`)
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
