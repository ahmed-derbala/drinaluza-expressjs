import { log } from '../log/index.js'

// returns title/content as localized objects
const purchase_request = ({ customer, products, price }) => {
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
			tn_arabl: `دينار ${price.total.tnd}  -  منتجات ${products.length} طلب شراء ${customer.name.tn_arab}`,
			tn_arab: `${customer.name.tn_arab} ${products.length} منتجات - ${price.total.tnd} دينار`
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

const purchase_updated_by_business = ({ customer, business }) => {
	return {
		title: {
			en: 'Purchase updated',
			fr: 'Achat mis à jour',
			tn_latn: 'Achra ttsajlet',
			tn_arab: 'تم تحديث الشراء'
		},
		content: {
			en: `${business.name.en} updated their purchase.`,
			fr: `${business.name.fr} a mis à jour leur achat.`,
			tn_latn: `${business.name.tn_latn} a mis à jour leur achat.`,
			tn_arab: `${business.name.tn_arab} حدثت عملية الشراء.`
		}
	}
}

const purchase_updated_by_customer = ({ customer, business }) => {
	return {
		title: {
			en: 'Purchase updated',
			fr: 'Achat mis à jour',
			tn_latn: 'Achra ttsajlet',
			tn_arab: 'تم تحديث الشراء'
		},
		content: {
			en: `${customer.name.en} updated their purchase.`,
			fr: `${customer.name.fr} a mis à jour leur achat.`,
			tn_latn: `${customer.name.tn_latn} a mis à jour leur achat.`,
			tn_arab: `${customer.name.tn_arab} حدثت عملية الشراء.`
		}
	}
}

export const templateRegistry = {
	purchase_request,
	purchase_created,
	purchase_updated_by_business,
	purchase_updated_by_customer
}
