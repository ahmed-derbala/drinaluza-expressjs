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

	let product = {}
	for (const business of businesses.docs) {
		for (const defaultProduct of defaultProducts.docs) {
			product = { ...defaultProduct }
			product.defaultProduct = { ...defaultProduct }
			product.slug = `${business.slug}-${defaultProduct.slug}`
			product.business = { ...business }
			await createProductSrvc(product)
		}
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
