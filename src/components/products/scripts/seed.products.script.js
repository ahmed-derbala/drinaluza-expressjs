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
		stock: { quantity: 50, minThreshold: 5 }
	},
	{
		//name: { en: 'Tuna', tn_latn: 'Thon', tn_arab: 'تونة' },
		searchKeywords: ['tuna', 'bluefin tuna', 'thon', 'تونة', 'fish', 'seafood'],
		price: { total: { tnd: 25 } },
		unit: { measure: 'kg', min: 1 }
	},
	{
		//name: { en: 'Salmon', tn_latn: 'Salmon', tn_arab: 'سلمون' },
		searchKeywords: ['atlantic salmon', 'salmon', 'سلمون', 'fish', 'seafood'],
		price: { total: { tnd: randomPrice(10, 300) } },
		unit: { measure: 'kg', min: 1 }
	},
	{
		//name: { en: 'Sardine', tn_latn: 'Sardina', tn_arab: 'سردينة' },
		searchKeywords: ['sardine', 'sardina', 'سردينة', 'oily fish', 'seafood'],
		price: { total: { tnd: randomPrice(5, 15) } },
		unit: { measure: 'kg', min: 1 }
	},
	{
		//name: { en: 'Octopus', tn_latn: 'Garnit', tn_arab: 'قرنيط' },
		searchKeywords: ['octopus', 'garnit', 'قرنيط', 'cephalopod', 'seafood'],
		price: { total: { tnd: randomPrice(15, 40) } },
		unit: { measure: 'kg', min: 1 }
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

	/*



	{
		name: { en: 'Sea Bream', tn_latn: 'Spares', tn_arab: 'شرغو' },
		searchKeywords: ['sea bream', 'spares', 'sparus', 'شرغو', 'fish', 'seafood'],
		price: { total: { tnd: randomPrice(12, 35) } }, unit: { measure: 'kg', min: 1 },

	},
	{
		name: { en: 'Sea Bass', tn_latn: 'Loups', tn_arab: 'وراطة' },
		searchKeywords: ['sea bass', 'loup de mer', 'loups', 'وراطة', 'fish', 'seafood'],
		price: { total: { tnd: randomPrice(15, 40) } }, unit: { measure: 'kg', min: 1 },

	},



	{
		name: { en: 'Cuttlefish', tn_latn: 'Sebbite', tn_arab: 'سبّيط' },
		searchKeywords: ['cuttlefish', 'sebbite', 'sepia', 'سبّيط', 'seafood'],
		price: { total: { tnd: randomPrice(10, 25) } }, unit: { measure: 'kg', min: 1 },

	},

	{
		name: { en: 'Mussels', tn_latn: 'Moules', tn_arab: 'محار' },
		searchKeywords: ['mussels', 'moules', 'محار', 'shellfish', 'seafood'],
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
			shop: shops.docs[0], //pickRandom(shops.docs),
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
