import mongoose from 'mongoose'
import config from '../../../config/index.js'
import { findUsersSrvc, addShopToUserSrvc } from '../../users/users.service.js'
import { log } from '../../../core/log/index.js'
import { createShopSrvc } from '../shops.service.js'
import { addShopToBusinessSrvc } from '../../businesses/businesses.service.js'
import { errorHandler } from '../../../core/error/index.js'

import { fileURLToPath } from 'node:url'
import path from 'node:path'
const __filename = fileURLToPath(import.meta.url)
const scriptFilename = path.basename(__filename)
import axios from 'axios'

export async function getRandomProductImage() {
	const { data: products } = await axios.get('https://fakestoreapi.com/products')

	if (!Array.isArray(products) || products.length === 0) {
		throw new Error('No products returned from API')
	}

	const randomProduct = products[Math.floor(Math.random() * products.length)]

	return randomProduct.image
}
const country = 'Tunisia',
	city = 'Sfax'

let manualShops = [
	{
		owner: { slug: 'ahmed' },
		name: { en: 'Drinaluza' },
		address: {
			street: `Main Street ${Math.floor(Math.random() * 1000) + 1}`,
			city: 'Sfax',
			country: country
		},
		location: {
			coordinates: [10.18, 36.8]
		},
		operatingHours: {
			monday: '9:00 AM - 5:00 PM',
			sunday: 'Closed'
		},
		deliveryRadiusKm: Math.floor(Math.random() * 20) + 5, // 5-25 km
		state: { code: 'active' },
		contact: {
			phone: {
				countryCode: '216',
				localNumber: '99112619',
				fullNumber: `+21699112619`
			},
			backupPhones: [
				{
					countryCode: '216',
					localNumber: Math.floor(Math.random() * 900000000) + 100000000,
					fullNumber: `+216${Math.floor(Math.random() * 900000000) + 100000000}`
				}
			],
			email: `drinaluza@gmail.com`,
			whatsapp: `+21699112619`
		},
		media: { thumbnail: { url: await getRandomProductImage() } }
	},
	{
		owner: { slug: 'mahdi-akid' },
		name: { en: 'Drayen Ellouza' },
		address: {
			street: 'ellouza',
			city: 'Sfax',
			country: 'Tunisia'
		},
		location: {
			coordinates: [10.18, 36.8]
		},
		operatingHours: {
			monday: '9:00 AM - 8:00 PM',
			sunday: 'Closed'
		},
		deliveryRadiusKm: 10,
		state: { code: 'active' }
	}
]

const processScript = async () => {
	log({ message: `running ${scriptFilename}`, level: 'info' })
	const shopOwners = await findUsersSrvc({ match: { role: 'shop_owner' }, select: 'slug _id name business' })
	if (shopOwners.docs.length === 0) {
		console.error('No owners found in the database. Please run the users seed script first.')
		return
	}
	log({ message: `Found ${shopOwners.docs.length} shop owners`, level: 'info' })

	for (let ms of manualShops) {
		const owner = shopOwners.docs.find((o) => o.slug === ms.owner.slug)
		ms.owner = owner
	}
	// Insert the documents
	for (const shop of manualShops) {
		const newShop = await createShopSrvc(shop)
		if (newShop) {
			await addShopToUserSrvc({ shop: newShop, userId: shop.owner._id })
			//add shop to business
			await addShopToBusinessSrvc({ businessId: shop.owner.business._id, shop: newShop })
		}
	}
	log({ message: `Inserted ${manualShops.length} shops`, level: 'info' })
}

async function run() {
	try {
		if (!config.security.allowScriptsInProdution && config.NODE_ENV === 'production') throw new Error('script is not allowed to run in production environment')
		await mongoose.connect(config.db.mongodb.uri, {})
		console.log(`Connected to MongoDB: ${config.db.mongodb.uri}`)
		await processScript()
	} catch (err) {
		errorHandler({ err })
		//console.error(err)
		process.exit(1)
	} finally {
		await mongoose.connection.close()
		console.log('MongoDB connection closed')
		process.exit(0)
	}
}
run()
