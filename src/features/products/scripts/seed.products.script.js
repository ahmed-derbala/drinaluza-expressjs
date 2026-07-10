import mongoose from 'mongoose'
import { createProductSrvc } from '../products.service.js'
import { findBusinessesSrvc } from '../../businesses/businesses.service.js'
import { log } from '../../../core/log/index.js'
import config from '../../../config/index.js'
import { pickRandom } from '../../../core/helpers/filters.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const __filename = fileURLToPath(import.meta.url)
const scriptFilename = path.basename(__filename)
import { findDefaultProductsSrvc } from '../../default-products/default-products.service.js'
import { UNITS } from '../schemas/unit.schema.js'

function randomPrice(min, max, decimals = 2) {
	const n = Math.random() * (max - min) + min
	return Number(n.toFixed(decimals))
}

let products = [
	{
		//name: { en: 'Shrimp', tn_latn: 'Crevet', tn_arab: 'قمرون' },
		searchKeywords: ['shrimp', 'crevet', 'crevette', 'قمرون', 'جمبري', 'prawn', 'seafood'],
		price: { total: { tnd: 25 } },
		unit: { measure: 'kg', min: 1 },
		stock: { quantity: 50, minThreshold: 5 },
		rating: {
			average: 5,
			count: 1,
			total: 5,
			breakdown: {
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				5: 1
			}
		},
		specs: {
			singlePieceMetrics: {
				length: 0.1,
				weight: 0.01
			},
			caliber: 1,
			origin: {
				street: 'Sfax',
				city: 'Sfax',
				country: 'Tunisia',
				region: 'Sfax'
			}
		}
	},
	{
		//name: { en: 'Tuna', tn_latn: 'Thon', tn_arab: 'تونة' },
		searchKeywords: ['tuna', 'bluefin tuna', 'thon', 'تونة', 'fish', 'seafood'],
		price: { total: { tnd: 25 } },
		unit: { measure: 'kg', min: 1 },
		specs: {
			singlePieceMetrics: {
				length: 0.1,
				weight: 0.01
			},
			caliber: 2,
			origin: {
				street: 'Sfax',
				city: 'Sfax',
				country: 'Tunisia',
				region: 'Sfax'
			}
		}
	},
	{
		//name: { en: 'Salmon', tn_latn: 'Salmon', tn_arab: 'سلمون' },
		searchKeywords: ['atlantic salmon', 'salmon', 'سلمون', 'fish', 'seafood'],
		price: { total: { tnd: randomPrice(10, 300) } },
		unit: { measure: 'kg', min: 1 },
		specs: {
			singlePieceMetrics: {
				length: 0.1,
				weight: 0.01
			},
			caliber: 3,
			origin: {
				street: 'Sfax',
				city: 'Sfax',
				country: 'Tunisia',
				region: 'Sfax'
			}
		}
	},
	{
		//name: { en: 'Sardine', tn_latn: 'Sardina', tn_arab: 'سردينة' },
		searchKeywords: ['sardine', 'sardina', 'سردينة', 'oily fish', 'seafood'],
		price: { total: { tnd: randomPrice(5, 15) } },
		unit: { measure: 'kg', min: 1 },
		specs: {
			singlePieceMetrics: {
				length: 0.1,
				weight: 0.01
			},
			caliber: 4,
			origin: {
				street: 'Sfax',
				city: 'Sfax',
				country: 'Tunisia',
				region: 'Sfax'
			}
		}
	},
	{
		//name: { en: 'Octopus', tn_latn: 'Garnit', tn_arab: 'قرنيط' },
		searchKeywords: ['octopus', 'garnit', 'قرنيط', 'cephalopod', 'seafood'],
		price: { total: { tnd: randomPrice(15, 40) } },
		unit: { measure: 'kg', min: 1 },
		specs: {
			singlePieceMetrics: {
				length: 0.1,
				weight: 0.01
			},
			caliber: 5,
			origin: {
				street: 'Sfax',
				city: 'Sfax',
				country: 'Tunisia',
				region: 'Sfax'
			}
		}
	},
	{
		//name: { en: 'Squid', tn_latn: 'Calamar', tn_arab: 'كلمار' },
		searchKeywords: ['squid', 'calamar', 'كلمار', 'cephalopod', 'seafood'],
		price: { total: { tnd: randomPrice(8, 25) } },
		unit: { measure: 'kg', min: 1 }
	},
	{
		//name: { en: 'Crab', tn_latn: 'Crabe', tn_arab: 'سلطعون' },
		searchKeywords: ['crab', 'crabe', 'سلطعون', 'shellfish', 'seafood'],
		price: { total: { tnd: randomPrice(20, 50) } },
		unit: { measure: 'kg', min: 1 }
	}
]

const processScript = async () => {
	log({ message: `running ${scriptFilename}`, level: 'info' })

	// Check Businesses
	const businesses = await findBusinessesSrvc({})
	//console.log(businesses)
	if (businesses.docs.length === 0) {
		log({ message: 'No businesses found. Please run businesses seed first.', level: 'warn' })
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
		const randomDefaultProduct = pickRandom(defaultProducts.docs)
		const randomBusiness = pickRandom(businesses.docs)
		return {
			...p,
			unit: {
				...p.unit,
				measure: pickRandom(UNITS)
			},
			business: randomBusiness,
			defaultProduct: randomDefaultProduct,
			searchKeywords: randomDefaultProduct.searchKeywords
		}
	})

	for (const product of products) {
		await createProductSrvc(product)
	}
	log({ message: `completed ${scriptFilename}`, level: 'info' })
}

async function run() {
	try {
		if (!config.security.allowScriptsInProdution && config.NODE_ENV === 'production') throw new Error('script is not allowed to run in production environment')
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
