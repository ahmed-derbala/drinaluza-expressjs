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

const country = 'Tunisia',
	city = 'Sfax'

let manualShops = [
	{
		owner: { slug: 'ahmed' },
		name: { en: 'Drinaluza' },
		address: {
			street: `ellouza, tri9 douar`,
			city: 'Sfax',
			country: country
		},
		location: {
			coordinates: [10.18, 36.8]
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
					localNumber: '99111222',
					fullNumber: `+21699111222`
				}
			],
			email: `drinaluza@gmail.com`,
			whatsapp: `+21699112619`
		},
		media: {
			thumbnail: {
				url: `https://scontent.ftun14-1.fna.fbcdn.net/v/t39.30808-6/566200084_1281876597315347_4989063260266431536_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=IbrnxUXCVEIQ7kNvwEeLyb0&_nc_oc=Adm0tSPjKADKEso1hU9hgV2khnZTlj4Mz0CErYEvpuTg4Je5yXj7Ne8lkoI9HxNMoiA&_nc_zt=23&_nc_ht=scontent.ftun14-1.fna&_nc_gid=sFJ-fE0Ho0eeXDbxcv4YoQ&_nc_ss=8&oh=00_AfxSOEqFaLXVnlZ2AUPno_Aa-b_bonOLMATnvTFK2ExqyQ&oe=69B4F823`
			}
		},
		rating: {
			average: 0,
			count: 0,
			total: 0,
			breakdown: {
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				5: 0
			}
		}
	}
	/*{
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
		state: { code: 'active' },
		media: {
			thumbnail: {
				url: `https://scontent.ftun14-1.fna.fbcdn.net/v/t39.30808-6/605233204_122149397024949667_5232592259142035782_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=p5BZ-Z6oBJcQ7kNvwHdbd8L&_nc_oc=Adm0Ju8hd_kWv3KWiZySgXe9B9tcBeyyxOymLGGJWTFZZFXFnn3oBo2WyzSB-iVNSVg&_nc_zt=23&_nc_ht=scontent.ftun14-1.fna&_nc_gid=Sw6x0Ei6vXijEC327zbyhw&_nc_ss=8&oh=00_AfyVPB6Gh_N3CF1Kkyp-pv_8erycnIpz74VgpKN56sqDRg&oe=69B51A72`
			}
		}
	}*/
]

const processScript = async () => {
	log({ message: `running ${scriptFilename}`, level: 'info' })
	const shopOwners = await findUsersSrvc({ match: { role: 'shop_owner' }, select: 'slug _id name business' })
	if (shopOwners.docs.length === 0) {
		console.error('No owners found in the database. Please run the users seed script first.')
		return
	}
	//log({ message: `Found ${shopOwners.docs.length} shop owners`, level: 'info' })

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
