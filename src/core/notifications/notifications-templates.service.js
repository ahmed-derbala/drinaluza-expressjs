import { log } from '#log'
let templates = {}

templates.pending = ({ customer, products, price }) => {
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
			tn_arab: `${customer.name.tn_arab} طلب شراء لـ ${products.length} منتجات بقيمة ${price.total.tnd} دينار`
		}
	}
}

templates.action_required = ({ customer, business }) => {
	return {
		title: {
			en: `Your order was adjusted by ${business.name.en}`,
			fr: `Votre commande a été modifiée par ${business.name.fr}`,
			tn_latn: `Commande mte3ek etbadlet men ${business.name.tn_latn}`,
			tn_arab: `تم تعديل طلبك من طرف ${business.name.tn_arab}`
		},
		content: {
			en: `${business.name.en} made changes to your order. Please review and confirm.`,
			fr: `${business.name.fr} a apporté des modifications à votre commande. Merci de vérifier et confirmer.`,
			tn_latn: `${business.name.tn_latn} 3adel el commande mte3ek. Confirmi el badlet.`,
			tn_arab: `${business.name.tn_arab} عدّل طلبك، يرجى المراجعة والتأكيد.`
		}
	}
}

templates.accepted = ({ customer }) => {
	return {
		title: {
			en: 'Order accepted',
			fr: 'Commande acceptée',
			tn_latn: 'Commande mte3ek accepté',
			tn_arab: 'تم قبول طلبك'
		},
		content: {
			en: `Thanks ${customer.name.en}, your order was accepted.`,
			fr: `Merci ${customer.name.fr}, votre commande a été acceptée.`,
			tn_latn: `Merci ${customer.name.tn_latn}, commande mte3ek accepté.`,
			tn_arab: `شكراً ${customer.name.tn_arab}، تم قبول طلبك.`
		}
	}
}

templates.preparing = ({ customer, business }) => {
	return {
		title: {
			en: `Your order is being prepared by ${business.name.en}`,
			fr: `Votre commande est en cours de préparation par ${business.name.fr}`,
			tn_latn: `Commande mte3ek ki tetheyya3 3end ${business.name.tn_latn}`,
			tn_arab: `طلبك قيد التحضير من طرف ${business.name.tn_arab}`
		},
		content: {
			en: `${business.name.en} is preparing your order.`,
			fr: `${business.name.fr} prépare votre commande.`,
			tn_latn: `${business.name.tn_latn} qa3ed yheyyi commande mte3ek.`,
			tn_arab: `${business.name.tn_arab} بصدد تحضير طلبك.`
		}
	}
}

templates.ready_for_pickup = ({ customer, business }) => {
	return {
		title: {
			en: 'Your order is ready for pickup',
			fr: 'Votre commande est prête pour le retrait',
			tn_latn: 'Commande mte3ek lahya, jiha t7ell',
			tn_arab: 'طلبك جاهز للاستلام'
		},
		content: {
			en: `Your order is ready, please come pick it up.`,
			fr: `Votre commande est prête, merci de venir la récupérer.`,
			tn_latn: `Commande mte3ek lahya, aji khodha.`,
			tn_arab: `طلبك جاهز، تفضل بالاستلام.`
		}
	}
}

templates.finding_courier = ({ customer, business }) => {
	return {
		title: {
			en: 'Finding a courier for your order',
			fr: "Recherche d'un livreur pour votre commande",
			tn_latn: 'Qa3din nal9iw livreur bech ywassal commande mte3ek',
			tn_arab: 'جاري البحث عن عامل توصيل لطلبك'
		},
		content: {
			en: `We're finding a courier to deliver your order.`,
			fr: `Nous recherchons un livreur pour votre commande.`,
			tn_latn: `9a3din nal9iw livreur ywassalek commande.`,
			tn_arab: `نبحث عن عامل توصيل لتوصيل طلبك.`
		}
	}
}

templates.courier_assigned = ({ customer, business }) => {
	return {
		title: {
			en: 'A courier has been assigned',
			fr: 'Un livreur a été assigné',
			tn_latn: 'Livreur t3ayen bech ywassal commande mte3ek',
			tn_arab: 'تم تعيين عامل توصيل لطلبك'
		},
		content: {
			en: `A courier has been assigned and will pick up your order soon.`,
			fr: `Un livreur a été assigné et récupérera votre commande bientôt.`,
			tn_latn: `Livreur t3ayen w bech yji ya5ou commande mte3ek.`,
			tn_arab: `تم تعيين عامل توصيل وسيستلم طلبك قريباً.`
		}
	}
}

templates.delivering = ({ customer, business }) => {
	return {
		title: {
			en: 'Your order is on its way',
			fr: 'Votre commande est en route',
			tn_latn: 'Commande mte3ek fi tari9 el wosoul',
			tn_arab: 'طلبك في الطريق إليك'
		},
		content: {
			en: `Your order is on its way to you.`,
			fr: `Votre commande est en route vers vous.`,
			tn_latn: `Commande mte3ek jaya lik.`,
			tn_arab: `طلبك في الطريق إليك.`
		}
	}
}

templates.delivered = ({ customer, business }) => {
	return {
		title: {
			en: 'Your order has been delivered',
			fr: 'Votre commande a été livrée',
			tn_latn: 'Commande mte3ek westlet',
			tn_arab: 'تم توصيل طلبك'
		},
		content: {
			en: `Your order has been delivered. Enjoy!`,
			fr: `Votre commande a été livrée. Bon appétit !`,
			tn_latn: `Commande mte3ek westlet, sa7a ftourek!`,
			tn_arab: `تم توصيل طلبك، بالهنا والشفا!`
		}
	}
}

templates.cancelled = ({ customer, business }) => {
	return {
		title: {
			en: 'Your order has been cancelled',
			fr: 'Votre commande a été annulée',
			tn_latn: 'Commande mte3ek etlghat',
			tn_arab: 'تم إلغاء طلبك'
		},
		content: {
			en: `Your order has been cancelled.`,
			fr: `Votre commande a été annulée.`,
			tn_latn: `Commande mte3ek etlghat.`,
			tn_arab: `تم إلغاء طلبك.`
		}
	}
}

export const NOTIFICATIONS_TEMPLATES = Object.fromEntries(Object.keys(templates).map((key) => [key, key]))
export const NOTIFICATIONS_TEMPLATES_ALL = Object.keys(templates)
export const notificationsTemplatesRegistry = {
	...templates
}
export default templates
