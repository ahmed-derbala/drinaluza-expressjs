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

// Sample owner data
const users = [
	{
		slug: 'abir',
		password: '123',
		role: 'shop_owner',
		name: { en: 'Abir Othmen' },
		media: {
			thumbnail: {
				url: `https://media.licdn.com/dms/image/v2/D4E35AQFF9g5SK9_wEg/profile-framedphoto-shrink_800_800/B4EZi3e2nCGUAg-/0/1755424975610?e=1771455600&v=beta&t=-_YJE1W5b5AAEXSf-Lc09TRfRC71jWNW2qzdVNm2FGs`
			}
		},
		location: {
			//type: 'Point',
			sharingEnabled: true,
			coordinates: [
				parseFloat((Math.random() * (longitudeRange[1] - longitudeRange[0]) + longitudeRange[0]).toFixed(4)),
				parseFloat((Math.random() * (latitudeRange[1] - latitudeRange[0]) + latitudeRange[0]).toFixed(4))
			]
		}
	},
	{
		slug: 'ahmed',
		password: '123',
		role: 'shop_owner',
		name: { en: 'Ahmed Derbala' },
		address: {
			street: `Main Street ${Math.floor(Math.random() * 1000) + 1}`,
			city: 'Ellouza',
			country: 'Tunisia',
			region: 'Sfax'
		},
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
			email: randomEmail(),
			whatsapp: generateTunisianPhone()
		},
		media: {
			thumbnail: {
				url: 'https://media.licdn.com/dms/image/v2/D4E03AQGrOYTGzw2t2A/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1699886542647?e=1772668800&v=beta&t=f4Isz3Znyg-QR9DvjSTbnQx23QSTaITtramAnRyuebM'
			}
		}
	},
	{
		slug: 'mahdi-akid',
		password: '123',
		role: 'shop_owner',
		name: { en: 'Mahdi Akid' },
		address: {
			street: `Main Street ${Math.floor(Math.random() * 1000) + 1}`,
			city: 'Ellouza',
			country: 'Tunisia',
			region: 'Sfax'
		}
	},
	{
		slug: 'safwen',
		password: '123',
		media: {
			thumbnail: {
				url: 'https://scontent.ftun15-1.fna.fbcdn.net/v/t39.30808-6/480797900_9563147623771985_8782635803627400360_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=2-gC3oPiHS4Q7kNvwFY3O0G&_nc_oc=AdmlH6InV5Si-4qeF4tOdXPqDRv6f_GrylbaxqQ2BIWnM-nefUUvYmboLWW4yXXO8fO9OfHYQMtXrijmgv4CCldc&_nc_zt=23&_nc_ht=scontent.ftun15-1.fna&_nc_gid=A9vO_FBR1vXsY8_kzREHnw&oh=00_Afp-LCl0oG6oTqgblkOoWUBukEk7z6SeqrFywutEOPKWPw&oe=696B3A81'
			}
		},
		role: 'customer',
		address: {
			street: `Main Street ${Math.floor(Math.random() * 1000) + 1}`,
			city: 'Ellouza',
			country: 'Tunisia',
			region: 'Sfax'
		},
		name: { en: 'Safwen Baklouti' },
		location: {
			sharingEnabled: true,
			coordinates: [
				parseFloat((Math.random() * (longitudeRange[1] - longitudeRange[0]) + longitudeRange[0]).toFixed(4)),
				parseFloat((Math.random() * (latitudeRange[1] - latitudeRange[0]) + latitudeRange[0]).toFixed(4))
			]
		},
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
			email: randomEmail(),
			whatsapp: generateTunisianPhone()
		}
	},
	{
		slug: 'hana',
		password: '123',
		role: 'customer',
		name: { en: 'Hana Derbala' }
	},
	{
		slug: 'souha',
		password: '123',
		role: 'customer',
		name: { en: 'Souha Derbala' }
	},
	{
		slug: 'serra',
		password: '123',
		role: 'customer',
		name: { en: 'Serra Aloui' }
	},
	{
		slug: 'rached',
		password: '123',
		role: 'customer',
		name: { en: 'Rached Fourati' },
		location: {
			sharingEnabled: true,
			coordinates: [
				parseFloat((Math.random() * (longitudeRange[1] - longitudeRange[0]) + longitudeRange[0]).toFixed(4)),
				parseFloat((Math.random() * (latitudeRange[1] - latitudeRange[0]) + latitudeRange[0]).toFixed(4))
			]
		}
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
