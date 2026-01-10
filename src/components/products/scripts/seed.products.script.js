import mongoose from 'mongoose'
import { createProductSrvc } from '../products.service.js'
import { findShopsSrvc } from '../../shops/shops.service.js'
import { log } from '../../../core/log/index.js'
import config from '../../../config/index.js'
import { pickRandom } from '../../../core/helpers/filters.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const __filename = fileURLToPath(import.meta.url)
const scriptFilename = path.basename(__filename)
import { findDefaultProductsSrvc } from '../../default-products/default-products.service.js'
import { UNITS } from '../schemas/unit.schema.js'
// Sample seafood products
let products = [
	{ name: { en: 'Dorade', fr: 'Dorade' }, price: { total: { tnd: 25 } }, unit: { measure: 'kg', min: 1 }, searchTerms: ['fish', 'dorade'], stock: { quantity: 50, minThreshold: 5 } },
	{ name: { en: 'Loup de mer', fr: 'Loup de mer' }, price: { total: { tnd: 32 } }, unit: { measure: 'KG', min: 1 }, searchTerms: ['fish', 'sea bass'], stock: { quantity: 40, minThreshold: 5 } }
	/*{ name: { en: 'Sardines', fr: 'Sardines' }, price: { total: { tnd: 12 }, unit: { measure: 'KG', min: 1 } }, searchTerms: ['fish', 'sardine'], stock: { quantity: 100, minThreshold: 10 } },
	{ name: { en: 'Crevettes', fr: 'Crevettes' }, price: { total: { tnd: 48 }, unit: { measure: 'KG', min: 1 } }, searchTerms: ['shrimp', 'prawn'], stock: { quantity: 30, minThreshold: 5 } },
	{ name: { en: 'Calamar', fr: 'Calamar' }, price: { total: { tnd: 40 }, unit: { measure: 'KG', min: 1 } }, searchTerms: ['squid', 'calamari'], stock: { quantity: 25, minThreshold: 5 } },
	{ name: { en: 'Moules', fr: 'Moules' }, price: { total: { tnd: 18 }, unit: { measure: 'KG', min: 1 } }, searchTerms: ['mussels'], stock: { quantity: 60, minThreshold: 10 } },
	{ name: { en: 'Thon', fr: 'Thon' }, price: { total: { tnd: 55 }, unit: { measure: 'KG', min: 1 } }, searchTerms: ['tuna'], stock: { quantity: 20, minThreshold: 3 } },
	{ name: { en: 'Seiche', fr: 'Seiche' }, price: { total: { tnd: 38 }, unit: { measure: 'KG', min: 1 } }, searchTerms: ['cuttlefish'], stock: { quantity: 15, minThreshold: 2 } },
	{ name: { en: 'Rouget', fr: 'Rouget' }, price: { total: { tnd: 28 }, unit: { measure: 'KG', min: 1 } }, searchTerms: ['red mullet'], stock: { quantity: 35, minThreshold: 5 } },
	{ name: { en: 'Huitres', fr: 'Huitres' }, price: { total: { tnd: 70 }, unit: { measure: 'KG', min: 1 } }, searchTerms: ['oyster'], stock: { quantity: 10, minThreshold: 2 } }
*/
]

const processScript = async () => {
	log({ message: `running ${scriptFilename}`, level: 'info' })

	// Check Shops
	const shops = await findShopsSrvc({})
	//console.log(shops)
	if (shops.docs.length === 0) {
		log({ message: 'No shops found. Please run shops seed first.', level: 'warn' })
		return
	}
	// Check default-products
	const defaultProducts = await findDefaultProductsSrvc({})
	//console.log(defaultProducts.docs)
	if (defaultProducts.docs.length === 0) {
		log({ message: 'No defaultProducts found. Please run defaultProducts seed first.', level: 'warn' })
		return
	}

	products = products.map((p) => {
		return {
			...p,
			unit: {
				...p.unit,
				measure: pickRandom(UNITS)
			},
			shop: pickRandom(shops.docs),
			defaultProduct: pickRandom(defaultProducts.docs)
		}
	})

	for (const product of products) {
		await createProductSrvc(product)
	}
	log({ message: `completed ${scriptFilename}`, level: 'info' })
}

async function run() {
	try {
		if (config.NODE_ENV === 'production') throw new Error('script is not allowed to run in production environment')
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
