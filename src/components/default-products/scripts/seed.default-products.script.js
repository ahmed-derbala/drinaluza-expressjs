/**
 * this script seeds default seafood products into the database
 */

import mongoose from 'mongoose'
import { DefaultProductModel } from '../default-products.schema.js'
import { defaultProductsCollection } from '../default-products.constant.js'
import { log } from '../../../core/log/index.js'
import config from '../../../config/index.js'

import { fileURLToPath } from 'node:url'
import path from 'node:path'
const __filename = fileURLToPath(import.meta.url)
const scriptFilename = path.basename(__filename)

const seafoodProducts = [
	{
		name: { en: 'Atlantic Salmon', tn_latn: 'Salmon', tn_arab: 'سلمون' },
		searchKeywords: ['atlantic salmon', 'salmon', 'سلمون', 'fish', 'seafood']
	},
	{
		name: { en: 'Tunisian Shrimp', tn_latn: 'Crevet', tn_arab: 'قمرون' },
		searchKeywords: ['shrimp', 'crevet', 'crevette', 'قمرون', 'جمبري', 'prawn', 'seafood']
	},
	{
		name: { en: 'Sea Bream', tn_latn: 'Spares', tn_arab: 'شرغو' },
		searchKeywords: ['sea bream', 'spares', 'sparus', 'شرغو', 'fish', 'seafood']
	},
	{
		name: { en: 'Sea Bass', tn_latn: 'Loups', tn_arab: 'وراطة' },
		searchKeywords: ['sea bass', 'loup de mer', 'loups', 'وراطة', 'fish', 'seafood']
	},
	{
		name: { en: 'Sardines', tn_latn: 'Sardina', tn_arab: 'سردينة' },
		searchKeywords: ['sardine', 'sardina', 'سردينة', 'oily fish', 'seafood']
	},
	{
		name: { en: 'Octopus', tn_latn: 'Garnit', tn_arab: 'قرنيط' },
		searchKeywords: ['octopus', 'garnit', 'قرنيط', 'cephalopod', 'seafood']
	},
	{
		name: { en: 'Squid', tn_latn: 'Calamar', tn_arab: 'كلمار' },
		searchKeywords: ['squid', 'calamar', 'كلمار', 'cephalopod', 'seafood']
	},
	{
		name: { en: 'Cuttlefish', tn_latn: 'Sebbite', tn_arab: 'سبّيط' },
		searchKeywords: ['cuttlefish', 'sebbite', 'sepia', 'سبّيط', 'seafood']
	},
	{
		name: { en: 'Bluefin Tuna', tn_latn: 'Thon', tn_arab: 'تونة' },
		searchKeywords: ['tuna', 'bluefin tuna', 'thon', 'تونة', 'fish', 'seafood']
	},
	{
		name: { en: 'Mussels', tn_latn: 'Moules', tn_arab: 'محار' },
		searchKeywords: ['mussels', 'moules', 'محار', 'shellfish', 'seafood']
	},
	{
		name: { en: 'Clams', tn_latn: 'Palourde', tn_arab: 'بلاميطا' },
		searchKeywords: ['clams', 'palourde', 'بلاميطا', 'shellfish', 'seafood']
	},
	{
		name: { en: 'Oysters', tn_latn: 'Huitres', tn_arab: 'محار صَدَفي' },
		searchKeywords: ['oysters', 'huitres', 'محار', 'shellfish', 'seafood']
	},
	{
		name: { en: 'Red Mullet', tn_latn: 'Trilia', tn_arab: 'بربوني' },
		searchKeywords: ['red mullet', 'trilia', 'بربوني', 'fish', 'seafood']
	},
	{
		name: { en: 'Anchovies', tn_latn: 'Anchois', tn_arab: 'أنشوفة' },
		searchKeywords: ['anchovies', 'anchois', 'أنشوفة', 'small fish', 'seafood']
	},
	{
		name: { en: 'Mackerel', tn_latn: 'Maquereau', tn_arab: 'سكمبري' },
		searchKeywords: ['mackerel', 'maquereau', 'سكمبري', 'oily fish', 'seafood']
	},
	{
		name: { en: 'Crab', tn_latn: 'Crabe', tn_arab: 'سلطعون' },
		searchKeywords: ['crab', 'crabe', 'سلطعون', 'shellfish', 'seafood']
	},
	{
		name: { en: 'Lobster', tn_latn: 'Homard', tn_arab: 'كركند' },
		searchKeywords: ['lobster', 'homard', 'كركند', 'shellfish', 'seafood']
	},
	{
		name: { en: 'Gilthead Bream', tn_latn: 'Dorade', tn_arab: 'دوراد' },
		searchKeywords: ['dorade', 'gilthead bream', 'دوراد', 'fish', 'seafood']
	},
	{
		name: { en: 'Swordfish', tn_latn: 'Espadon', tn_arab: 'سمك أبو سيف' },
		searchKeywords: ['swordfish', 'espadon', 'أبو سيف', 'fish', 'seafood']
	},
	{
		name: { en: 'Eel', tn_latn: 'Anguille', tn_arab: 'حنكليس' },
		searchKeywords: ['eel', 'anguille', 'حنكليس', 'fish', 'seafood']
	}
]
/*
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
*/
const processScript = async () => {
	log({ message: `running ${scriptFilename}`, level: 'info' })
	await DefaultProductModel.insertMany(seafoodProducts, { ordered: false })
	const count = await DefaultProductModel.countDocuments()
	log({ message: `Total documents in ${defaultProductsCollection}: ${count}`, level: 'info' })

	log({ message: `${scriptFilename} completed successfully`, level: 'info' })
	return true
}

async function run() {
	try {
		//if (config.NODE_ENV === 'production') throw new Error('script is not allowed to run in production environment')
		await mongoose.connect(config.db.mongodb.uri, {})
		console.log(`Connected to MongoDB: ${config.db.mongodb.uri}`)
		await processScript()
	} catch (error) {
		console.error('script error:', error)
	} finally {
		await mongoose.connection.close()
		console.log('MongoDB connection closed')
	}
}
run()
