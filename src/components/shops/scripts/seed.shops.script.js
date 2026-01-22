import mongoose from 'mongoose'
import config from '../../../config/index.js'
import { stateEnum } from '../../../core/db/mongodb/shared-schemas/state.schema.js'
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
const cityNames = ['Sfax', 'Tunis', 'Sousse', 'Djerba', 'Hammamet']
const randomCityIndex = Math.floor(Math.random() * cityNames.length)
const country = 'Tunisia'
const longitudeRange = [8.5, 11.5] // Approx. longitude range for Tunisia
const latitudeRange = [33.5, 37.5] // Approx. latitude range for Tunisia
const shopNames = [
	's1',
	's2',
	's3',
	's4',
	'D',
	'The Oyster Bar',
	'Fresh Fish & Co.',
	'Aqua Harvest',
	"Poseidon's Platter",
	'The Gilded Clam',
	'Coral Cove',
	"Triton's Treasure",
	'Lighthouse Seafood',
	'The Catch of the Day',
	'Deep Blue Deli'
]

const generateRandomShop = async (owner, index) => {
	// Updated cities to be in Tunisia
	// Set the country to Tunisia for all shops
	const randomName = shopNames[index % shopNames.length]
	const randomState = stateEnum.ALL[index % stateEnum.ALL.length]

	return {
		owner,
		name: { en: randomName },
		address: {
			street: `Main Street ${Math.floor(Math.random() * 1000) + 1}`,
			city: cityNames[randomCityIndex],
			country: country
		},
		location: {
			type: 'Point',
			coordinates: [
				parseFloat((Math.random() * (longitudeRange[1] - longitudeRange[0]) + longitudeRange[0]).toFixed(4)),
				parseFloat((Math.random() * (latitudeRange[1] - latitudeRange[0]) + latitudeRange[0]).toFixed(4))
			]
		},
		media: { thumbnail: { url: await getRandomProductImage() } },
		operatingHours: {
			monday: '9:00 AM - 5:00 PM',
			sunday: 'Closed'
		},
		deliveryRadiusKm: Math.floor(Math.random() * 20) + 5, // 5-25 km
		state: { code: randomState },
		contact: {
			phone: {
				countryCode: '216',
				localNumber: Math.floor(Math.random() * 900000000) + 100000000,
				fullNumber: `+216${Math.floor(Math.random() * 900000000) + 100000000}`
			},
			backupPhones: [
				{
					countryCode: '216',
					localNumber: Math.floor(Math.random() * 900000000) + 100000000,
					fullNumber: `+216${Math.floor(Math.random() * 900000000) + 100000000}`
				}
			],
			email: `shop${index}@example.com`,
			whatsapp: `+216${Math.floor(Math.random() * 900000000) + 100000000}`
		}
	}
}

let manualShops = [
	{
		owner: { slug: 'so1' },
		name: { en: 'Drinaluza' },
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
	},
	{
		owner: { slug: 'ahmed' },
		name: { en: 'Drinaluza' },
		address: {
			street: `Main Street ${Math.floor(Math.random() * 1000) + 1}`,
			city: cityNames[randomCityIndex],
			country: country
		},
		location: {
			type: 'Point',
			coordinates: [
				parseFloat((Math.random() * (longitudeRange[1] - longitudeRange[0]) + longitudeRange[0]).toFixed(4)),
				parseFloat((Math.random() * (latitudeRange[1] - latitudeRange[0]) + latitudeRange[0]).toFixed(4))
			]
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
		}
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

	// Generate shop documents - distribute shops among available owners
	let shopsToInsert = []
	for (let i = 0; i < 10; i++) {
		const owner = shopOwners.docs[i % shopOwners.docs.length] // Cycle through owners
		const s = await generateRandomShop(owner, i)
		console.log(s.media)
		shopsToInsert.push(s)
	}
	shopsToInsert = [...shopsToInsert, ...manualShops]
	// Insert the documents
	for (const shop of shopsToInsert) {
		const newShop = await createShopSrvc(shop)
		if (newShop) {
			await addShopToUserSrvc({ shop: newShop, userId: shop.owner._id })
			//add shop to business
			await addShopToBusinessSrvc({ businessId: shop.owner.business._id, shop: newShop })
		}
	}
	log({ message: `Inserted ${shopsToInsert.length} shops`, level: 'info' })
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
