import { log } from '../log/index.js'

// returns title/content as localized objects
const purchase_request = ({ customer, shop, products, price }) => {
	return {
		title: {
			en: 'Purchase request',
			fr: "Demande d'achat",
			tn_latn: "Demande d'achat",
			tn_arab: 'طلب شراء'
		},
		content: {
			en: `${customer.name.en} requested a purchase.`,
			fr: `${customer.name.fr} a demandé un achat.`,
			tn_latn: `${customer.name.tn_latn} a demandé un achat.`,
			tn_arab: `${customer.name.tn_arab} طلب شراء.`
		}
	}
}

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
	purchase_request,
	purchase_created
}
