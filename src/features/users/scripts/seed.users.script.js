import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { connectMongodb, disconnectMongodb } from '#mongodb'
import { createUserSrvc } from '../users.service.js'
import { log } from '#log'
import { config } from '#config'
import { createAuthSrvc } from '#auth'

const __filename = fileURLToPath(import.meta.url)
const scriptFilename = path.basename(__filename)

const ahmed_photo_url = 'https://res.cloudinary.com/dyhvqubig/image/upload/v1779924971/uploads/uhkrbhape2mryaxzo3vt.jpg'
const abir_photo_url = 'https://res.cloudinary.com/dyhvqubig/image/upload/v1779925385/uploads/gxo01783ek77bxme9n4b.png'
const amin_chalbi_photo_url = 'https://res.cloudinary.com/dyhvqubig/image/upload/v1784032760/uploads/n2usaat0i8gpyheomhkh.jpg'
const majed_akid_photo_url = 'https://res.cloudinary.com/dyhvqubig/image/upload/v1784041793/uploads/pebjuyqjkorhxzy6hhtw.jpg'

const mahdi_phone = { countryCode: '216', localNumber: '95503160', fullNumber: '+21695503160' }
const ahmed_phone = { countryCode: '216', localNumber: '99112619', fullNumber: '+21699112619' }
const drinaluza_email = 'drinaluza@gmail.com'

const users = [
	{
		slug: 'ahmed',
		password: '123',
		roles: ['customer', 'business_owner'],
		name: { en: 'ahmed' },
		address: { street: { en: 'ellouza', tn_latn: 'ellouza', tn_arab: 'ellouza' }, city: 'Ellouza', country: 'Tunisia', region: 'Sfax' },
		contact: { phone: ahmed_phone, backupPhones: [ahmed_phone], email: drinaluza_email, whatsapp: ahmed_phone.fullNumber }
	},
	{
		slug: 'sirage-benhassen',
		password: '123',
		roles: ['customer', 'business_owner'],
		name: { en: 'Sirage Benhassen' },
		address: { street: { en: 'ellouza', tn_latn: 'ellouza', tn_arab: 'ellouza' }, city: 'Ellouza', country: 'Tunisia', region: 'Sfax' }
	},
	{
		slug: 'mahdi-akid',
		password: '123',
		roles: ['customer', 'business_owner'],
		name: { en: 'Mahdi Akid' },
		address: { street: { en: 'ellouza', tn_latn: 'ellouza', tn_arab: 'ellouza' }, city: 'Ellouza', country: 'Tunisia', region: 'Sfax' },
		contact: { phone: mahdi_phone, backupPhones: [mahdi_phone], whatsapp: mahdi_phone.fullNumber }
	},
	{
		slug: 'ahmed-chalbi',
		password: '123',
		roles: ['customer', 'business_owner'],
		name: { en: 'Ahmed Chalbi' },
		address: { street: { en: 'ellouza', tn_latn: 'ellouza', tn_arab: 'ellouza' }, city: 'Ellouza', country: 'Tunisia', region: 'Sfax' }
	},
	{
		slug: 'majed-akid',
		password: '123',
		roles: ['customer', 'business_owner'],
		name: { en: 'Majed Akid' },
		address: { street: { en: 'ellouza', tn_latn: 'ellouza', tn_arab: 'ellouza' }, city: 'Ellouza', country: 'Tunisia', region: 'Sfax' },
		contact: { phone: ahmed_phone, backupPhones: [ahmed_phone], email: drinaluza_email, whatsapp: ahmed_phone.fullNumber },
		media: { thumbnail: { url: majed_akid_photo_url } }
	},
	{
		slug: 'amin-chalbi',
		password: '123',
		roles: ['customer', 'business_owner'],
		name: { en: 'Amin Chalbi' },
		address: { street: { en: 'ellouza', tn_latn: 'ellouza', tn_arab: 'ellouza' }, city: 'Ellouza', country: 'Tunisia', region: 'Sfax' },
		contact: { phone: ahmed_phone, backupPhones: [ahmed_phone], email: drinaluza_email, whatsapp: ahmed_phone.fullNumber },
		media: { thumbnail: { url: amin_chalbi_photo_url } }
	},
	{
		slug: 'sahbi-aloui',
		password: '123',
		roles: ['customer', 'business_owner'],
		name: { en: 'Sahbi Aloui' },
		address: { street: { en: 'ellouza', tn_latn: 'ellouza', tn_arab: 'ellouza' }, city: 'Ellouza', country: 'Tunisia', region: 'Sfax' }
	},
	{
		slug: 'client',
		password: '123',
		roles: ['customer'],
		name: { en: 'client sfaxi' },
		address: { street: { en: 'beb jebli', tn_latn: 'beb jebli', tn_arab: 'beb jebli' }, city: 'sfax', country: 'Tunisia', region: 'Sfax' }
	},
	{
		slug: 'serra',
		password: '123',
		roles: ['customer'],
		name: { en: 'Serra Aloui' }
	},
	{
		slug: 'abir',
		password: '123',
		roles: ['customer'],
		name: { en: 'Abir Othmen' },
		media: { thumbnail: { url: abir_photo_url } }
	}
]

const processScript = async () => {
	log({ message: `running ${scriptFilename}`, level: 'info' })
	for (const userData of users) {
		const signedupUser = await createUserSrvc(userData)
		await createAuthSrvc({ user: signedupUser, password: userData.password })
		log({ message: `Created user: ${userData.slug}`, level: 'info' })
	}
	log({ message: 'Owners seed completed successfully', level: 'info' })
}

export async function seedUsers() {
	try {
		if (!config.security.allowScriptsInProdution && config.node.env === 'production') {
			throw new Error('script is not allowed to run in production environment')
		}
		await connectMongodb()
		await processScript()
	} catch (error) {
		log({ message: `seedUsers error: ${error.message}`, level: 'error' })
		throw error
	} finally {
		await disconnectMongodb()
	}
}

const currentFilePath = fileURLToPath(import.meta.url)
const executedFilePath = fs.realpathSync(process.argv[1])

if (currentFilePath === executedFilePath) {
	seedUsers()
}
