import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { connectMongodb, disconnectMongodb } from '#mongodb'
import { createProductSrvc, updateProductSrvc } from '../products.service.js'
import { findBusinessesSrvc } from '../../businesses/businesses.service.js'
import { findDefaultProductsSrvc } from '../../default-products/default-products.service.js'
import { log } from '#log'
import { config } from '#config'

const __filename = fileURLToPath(import.meta.url)
const scriptFilename = path.basename(__filename)

function generateRandomRating() {
	const count = Math.floor(Math.random() * 500) + 1
	const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
	const weights = [
		{ star: 1, weight: 2 },
		{ star: 2, weight: 4 },
		{ star: 3, weight: 10 },
		{ star: 4, weight: 30 },
		{ star: 5, weight: 54 }
	]

	const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0)
	let total = 0

	for (let i = 0; i < count; i++) {
		let r = Math.random() * totalWeight
		for (const { star, weight } of weights) {
			r -= weight
			if (r <= 0) {
				breakdown[star]++
				total += star
				break
			}
		}
	}

	return {
		average: Number((total / count).toFixed(1)),
		count,
		total,
		breakdown
	}
}

const processScript = async () => {
	log({ message: `running ${scriptFilename}`, level: 'info' })

	const businesses = await findBusinessesSrvc({})
	if (businesses.docs.length === 0) {
		log({ message: 'No businesses found. Please run businesses seed first.', level: 'warn' })
		return
	}

	const defaultProducts = await findDefaultProductsSrvc({})
	if (defaultProducts.docs.length === 0) {
		log({ message: 'No defaultProducts found. Please run defaultProducts seed first.', level: 'warn' })
		return
	}

	for (const business of businesses.docs) {
		for (const defaultProduct of defaultProducts.docs) {
			const product = {
				...defaultProduct,
				defaultProduct: { ...defaultProduct },
				slug: `${business.slug}-${defaultProduct.slug}`,
				business: { ...business }
			}
			const createdProduct = await createProductSrvc(product)
			const rating = generateRandomRating()
			await updateProductSrvc({ match: { slug: createdProduct.slug }, newData: { rating } })
		}
	}
	log({ message: `completed ${scriptFilename}`, level: 'info' })
}

export async function seedProducts() {
	try {
		if (!config.security.allowScriptsInProdution && config.node.env === 'production') {
			throw new Error('script is not allowed to run in production environment')
		}
		await connectMongodb()
		await processScript()
	} catch (error) {
		log({ message: `seedProducts error: ${error.message}`, level: 'error' })
		throw error
	} finally {
		await disconnectMongodb()
	}
}

const currentFilePath = fileURLToPath(import.meta.url)
const executedFilePath = fs.realpathSync(process.argv[1])

if (currentFilePath === executedFilePath) {
	seedProducts()
}
