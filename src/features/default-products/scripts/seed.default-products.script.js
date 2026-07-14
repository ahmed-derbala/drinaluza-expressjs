/**
 * this script seeds default seafood products into the database
 */

import mongoose from 'mongoose'
import { DefaultProductModel } from '../default-products.schema.js'
import { defaultProductsCollection } from '../default-products.constant.js'
import { log } from '../../../core/log/index.js'
import config from '../../../config/index.js'
import { createDefaultProductSrvc } from '../default-products.service.js'

import { fileURLToPath } from 'node:url'
import path from 'node:path'
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
			harvest: 'wild'
		}
	},
	{
		name: { en: 'Tuna', tn_latn: 'Thon', tn_arab: 'تن' },
		searchKeywords: ['tuna', 'bluefin tuna', 'thon', 'تونة', 'fish', 'seafood', 'تن'],
		price: {
			total: { tnd: 10 }
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
		name: { en: 'Salmon', tn_latn: 'Salmon', tn_arab: 'سلمون' },
		searchKeywords: ['atlantic salmon', 'salmon', 'سلمون', 'fish', 'seafood', 'سومون'],
		price: {
			total: { tnd: 35 }
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
			harvest: 'wild'
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
			harvest: 'wild'
		}
	},
	{
		name: { en: 'Octopus', tn_latn: 'Garnit', tn_arab: 'قرنيط' },
		searchKeywords: ['octopus', 'garnit', 'قرنيط', 'cephalopod', 'seafood'],
		price: {
			total: { tnd: 60 }
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
			harvest: 'wild'
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
			harvest: 'wild'
		}
	}
]

const processScript = async () => {
	log({ message: `running ${scriptFilename}`, level: 'info' })
	for (let dp of defaultProducts) {
		await createDefaultProductSrvc(dp)
	}
	const count = await DefaultProductModel.countDocuments()
	log({ message: `Total documents in ${defaultProductsCollection}: ${count}`, level: 'info' })
	log({ message: `${scriptFilename} completed successfully`, level: 'info' })
	return true
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
