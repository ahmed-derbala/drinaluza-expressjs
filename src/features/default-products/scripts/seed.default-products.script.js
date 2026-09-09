// src/features/default-products/scripts/seed.default-products.script.js
/**
 * this script seeds default seafood products into the database
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { connectMongodb, disconnectMongodb } from '#mongodb'
import { config } from '#config'
import { log } from '#log'
import { DefaultProductModel } from '../default-products.schema.js'
import { defaultProductsCollection } from '../default-products.constant.js'
import { createDefaultProductSrvc } from '../default-products.service.js'

const __filename = fileURLToPath(import.meta.url)
const scriptFilename = path.basename(__filename)

const defaultProducts = [
	{
		name: { en: 'Shrimp', tn_latn: 'Crevet', tn_arab: 'كروفات' },
		searchKeywords: ['shrimp', 'crevet', 'crevette', 'قمرون', 'جمبري', 'prawn', 'seafood', 'كروفات', 'كرفات', 'كرفت'],
		price: {
			total: { tnd: 15 }
		},
		unit: {
			measure: 'kg',
			min: 1,
			max: 10,
			step: 1
		},
		state: { code: 'active' },
		availability: {
			startDate: Date.now()
		},
		stock: {
			quantity: 100,
			minThreshold: 10
		},
		specs: {
			caliber: 5,
			harvest: 'farm',
			gear: 'trap'
		}
	},
	{
		name: { en: 'Tuna', tn_latn: 'Thon', tn_arab: 'تن' },
		searchKeywords: ['tuna', 'bluefin tuna', 'thon', 'تونة', 'fish', 'seafood', 'تن'],
		price: {
			total: { tnd: 10 }
		},
		unit: {
			measure: 'piece',
			min: 1,
			max: 10,
			step: 1
		},
		state: { code: 'active' },
		availability: {
			startDate: Date.now()
		},
		stock: {
			quantity: 100,
			minThreshold: 10
		},
		specs: {
			caliber: 4,
			harvest: 'wild',
			gear: 'gillnet'
		}
	},
	{
		name: { en: 'Salmon', tn_latn: 'Salmon', tn_arab: 'سلمون' },
		searchKeywords: ['atlantic salmon', 'salmon', 'سلمون', 'fish', 'seafood', 'سومون'],
		price: {
			total: { tnd: 35 }
		},
		unit: {
			measure: 'kg',
			min: 1,
			max: 10,
			step: 1,
			singlePiece: {
				maxWeightKg: 1,
				avgWeightKg: 0.75,
				minWeightKg: 0.5
			}
		},
		state: { code: 'active' },
		availability: {
			startDate: Date.now()
		},
		stock: {
			quantity: 100,
			minThreshold: 10
		},
		specs: {
			caliber: 3,
			harvest: 'farm',
			gear: 'trap'
		}
	},
	{
		name: { en: 'Sardine', tn_latn: 'Sardina', tn_arab: 'سردينة' },
		searchKeywords: ['sardine', 'sardina', 'سردينة', 'oily fish', 'seafood'],
		price: {
			total: { tnd: 5 }
		},
		unit: {
			measure: 'kg',
			min: 1,
			max: 10,
			step: 1
		},
		state: { code: 'active' },
		availability: {
			startDate: Date.now()
		},
		stock: {
			quantity: 100,
			minThreshold: 10
		},
		specs: {
			caliber: 2,
			harvest: 'wild',
			gear: 'gillnet'
		}
	},
	{
		name: { en: 'Octopus', tn_latn: 'Garnit', tn_arab: 'قرنيط' },
		searchKeywords: ['octopus', 'garnit', 'قرنيط', 'cephalopod', 'seafood'],
		price: {
			total: { tnd: 45 }
		},
		unit: {
			measure: 'kg',
			min: 1,
			max: 10,
			step: 1,
			singlePiece: {
				maxWeightKg: 5,
				avgWeightKg: 3.5,
				minWeightKg: 2
			}
		},
		state: { code: 'active' },
		availability: {
			startDate: Date.now()
		},
		stock: {
			quantity: 100,
			minThreshold: 10
		},
		specs: {
			caliber: 5,
			harvest: 'farm',
			gear: 'trap'
		}
	},
	{
		name: { en: 'Squid', tn_latn: 'Calamar', tn_arab: 'كلمار' },
		searchKeywords: ['squid', 'calamar', 'كلمار', 'cephalopod', 'seafood'],
		price: {
			total: { tnd: 24 }
		},
		unit: {
			measure: 'kg',
			min: 1,
			max: 10,
			step: 1
		},
		state: { code: 'active' },
		availability: {
			startDate: Date.now()
		},
		stock: {
			quantity: 100,
			minThreshold: 10
		},
		specs: {
			caliber: 4,
			harvest: 'wild'
		}
	},
	{
		name: { en: 'Crab', tn_latn: 'Daech', tn_arab: 'داعش' },
		searchKeywords: ['crab', 'crabe', 'سلطعون', 'shellfish', 'seafood', 'داعش'],
		price: {
			total: { tnd: 5 }
		},
		unit: {
			measure: 'kg',
			min: 1,
			max: 10,
			step: 1
		},
		state: { code: 'active' },
		availability: {
			startDate: Date.now()
		},
		stock: {
			quantity: 100,
			minThreshold: 10
		},
		specs: {
			caliber: 3,
			harvest: 'farm'
		}
	}
]

const processScript = async () => {
	log({ message: `running ${scriptFilename}`, level: 'info' })
	for (const dp of defaultProducts) {
		await createDefaultProductSrvc(dp)
	}
	const count = await DefaultProductModel.countDocuments()
	log({ message: `Total documents in ${defaultProductsCollection}: ${count}`, level: 'info' })
	log({ message: `${scriptFilename} completed successfully`, level: 'info' })
	return true
}

export async function seedDefaultProducts() {
	try {
		if (!config.security.allowScriptsInProdution && config.NODE_ENV === 'production') {
			throw new Error('script is not allowed to run in production environment')
		}
		await connectMongodb()
		await processScript()
	} catch (error) {
		log({ message: `seedDefaultProducts error: ${error.message}`, level: 'error' })
		throw error
	} finally {
		await disconnectMongodb()
	}
}

// Only execute directly when triggered via CLI / NPM script
const currentFilePath = fileURLToPath(import.meta.url)
const executedFilePath = fs.realpathSync(process.argv[1])

if (currentFilePath === executedFilePath) {
	seedDefaultProducts()
}
