import { createUserSrvc } from '../users.service.js'
import { log } from '../../../core/log/index.js'
import mongoose from 'mongoose'
import config from '../../../config/index.js'
import { createAuthSrvc } from '../../../core/auth/auth.service.js'
import { randomEmail, generateTunisianPhone } from '../../../core/helpers/randoms.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const __filename = fileURLToPath(import.meta.url)
const scriptFilename = path.basename(__filename)

const longitudeRange = [8.5, 11.5] // Approx. longitude range for Tunisia
const latitudeRange = [33.5, 37.5] // Approx. latitude range for Tunisia

const ahmed_photo_url = 'https://res.cloudinary.com/dyhvqubig/image/upload/v1779924971/uploads/uhkrbhape2mryaxzo3vt.jpg'
const abir_photo_url = 'https://res.cloudinary.com/dyhvqubig/image/upload/v1779925385/uploads/gxo01783ek77bxme9n4b.png'
const amin_chalbi_photo_url = 'https://res.cloudinary.com/dyhvqubig/image/upload/v1779924971/uploads/uhkrbhape2mryaxzo3vt.jpg'
const majed_akid_photo_url = 'https://res.cloudinary.com/dyhvqubig/image/upload/v1784041793/uploads/pebjuyqjkorhxzy6hhtw.jpg'
const mahdi_phone = {
	countryCode: '216',
	localNumber: '95503160',
	fullNumber: '+21695503160'
}
const ahmed_phone = {
	countryCode: '216',
	localNumber: '99112619',
	fullNumber: '+21699112619'
}
const drinaluza_email = 'drinaluza@gmail.com'
// Sample owner data
const users = [
	{
		slug: 'ahmed',
		password: '123',
		role: 'business_owner',
		name: { en: 'Ahmed Derbala' },
		address: {
			street: `ellouza`,
			city: 'Ellouza',
			country: 'Tunisia',
			region: 'Sfax'
		},
		contact: {
			phone: ahmed_phone,
			backupPhones: [ahmed_phone],
			email: drinaluza_email,
			whatsapp: ahmed_phone.fullNumber
		},
		media: {
			thumbnail: {
				url: ahmed_photo_url
			}
		}
	},
	{
		slug: 'mahdi-akid',
		password: '123',
		role: 'business_owner',
		name: { en: 'Mahdi Akid' },
		address: {
			street: `ellouza`,
			city: 'Ellouza',
			country: 'Tunisia',
			region: 'Sfax'
		},
		contact: {
			phone: mahdi_phone,
			backupPhones: [mahdi_phone],
			//email: drinaluza_email,
			whatsapp: mahdi_phone.fullNumber
		}
		/*media: {
			thumbnail: {
				url: ahmed_photo_url
			}
		}*/
	},
	{
		slug: 'majed-akid',
		password: '123',
		role: 'business_owner',
		name: { en: 'Majed Akid' },
		address: {
			street: `ellouza`,
			city: 'Ellouza',
			country: 'Tunisia',
			region: 'Sfax'
		},
		contact: {
			phone: ahmed_phone,
			backupPhones: [ahmed_phone],
			email: drinaluza_email,
			whatsapp: ahmed_phone.fullNumber
		},
		media: {
			thumbnail: {
				url: majed_akid_photo_url
			}
		}
	},
	{
		slug: 'amin-chalbi',
		password: '123',
		role: 'business_owner',
		name: { en: 'Amin Chalbi' },
		address: {
			street: `ellouza`,
			city: 'Ellouza',
			country: 'Tunisia',
			region: 'Sfax'
		},
		contact: {
			phone: ahmed_phone,
			backupPhones: [ahmed_phone],
			email: drinaluza_email,
			whatsapp: ahmed_phone.fullNumber
		},
		media: {
			thumbnail: {
				url: amin_chalbi_photo_url
			}
		}
	},
	{
		slug: 'serra',
		password: '123',
		role: 'business_owner',
		name: { en: 'Serra Aloui' }
	},
	{
		slug: 'abir',
		password: '123',
		role: 'customer',
		name: { en: 'Abir Othmen' },
		media: {
			thumbnail: {
				url: abir_photo_url
			}
		}
	},
	{
		slug: 'souha',
		password: '123',
		role: 'customer',
		name: { en: 'Souha Derbala' }
	},
	{
		slug: 'rached',
		password: '123',
		role: 'customer',
		name: { en: 'Rached Fourati' }
	},
	{
		slug: 'brahim',
		password: '123',
		role: 'customer',
		name: { en: 'Brahim Haj Mohamed' }
	}
]

const processScript = async () => {
	log({ message: `running ${scriptFilename}`, level: 'info' })
	// Create each owner
	for (const userData of users) {
		const signedupUser = await createUserSrvc(userData)
		await createAuthSrvc({ user: signedupUser, password: userData.password })
		log({ message: `Created user: ${userData.slug}`, level: 'info' })
	}
	log({ message: 'Owners seed completed successfully', level: 'success' })
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
