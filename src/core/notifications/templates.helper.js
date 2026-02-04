import { log } from '../log/index.js'

// returns title/content as localized objects
const purchase_created = ({ user }) => {
	log({
		level: 'debug',
		message: 'purchase created helper',
		data: { user }
	})

	return {
		title: {
			en: 'Purchase confirmed',
			fr: 'Achat confirmé',
			tn_latn: 'Achra ttsajlet',
			tn_arab: 'تم تأكيد الشراء'
		},
		content: {
			en: `Thanks ${user.name.en}, your purchase was created.`,
			fr: `Merci ${user.name.fr}, votre achat a été créé.`,
			tn_latn: `Merci ${user.name.tn_latn}, l-achra ttsajlet.`,
			tn_arab: `شكراً ${user.name.tn_arab}، تم إنشاء عملية الشراء.`
		}
	}
}

export const templateRegistry = {
	purchase_created
}
