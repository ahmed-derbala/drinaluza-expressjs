import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import { config } from '#config'
import { findOneOrderRepo, patchOrderStatusRepo, appendProductsToOrderRepo } from './purchases.repository.js'
import { ORDER_STATUSES } from '#orders/orders.constant.js'
import { isValidStatusTransitionSrvc } from '#orders/orders.service.js'
import { createdOrderRepo } from '#orders/orders.repository.js'
import { notify, NOTIFICATIONS_TEMPLATES } from '#notifications'
import { USER_ROLES } from '#users'

export const findOnePurchaseSrvc = async ({ match, select }) => {
	const fetchedOrder = await findOneOrderRepo({ match, select })
	return fetchedOrder
}

export const createPurchaseSrvc = async ({ customer, business, products, price }) => {
	log({ level: 'debug', message: 'createPurchaseSrvc', data: { customer, business, products, price } })
	const createdPurchase = await createdOrderRepo({ customer, business, products, status: ORDER_STATUSES.pending, price })
	if (createdPurchase) {
		notify({
			user: business.owner,
			screen: `/dashboard/${business.slug}/sales/${createdPurchase._id}`,
			template: { slug: NOTIFICATIONS_TEMPLATES[createdPurchase.status], data: { customer, products, price } },
			media: customer.media
		})
	}
	return createdPurchase
}

export const processLineTotalSrvc = ({ price, quantity }) => {
	//log({level:'debug',message:'process line total',data:{price,quantity}})
	return { tnd: price.total.tnd * quantity, usd: price.total.usd * quantity || null, eur: price.total.eur * quantity || null }
}

export const patchOrderStatusSrvc = async ({ match, oldStatus, newStatus, purchase }) => {
	const role = USER_ROLES.customer
	if (!isValidStatusTransitionSrvc({ oldStatus: oldStatus.status, newStatus, role })) {
		log({ level: 'debug', message: 'invalid status transition', data: { oldStatus, newStatus } })
		return { message: 'invalid status transition', data: null }
	}
	const patchedOrder = await patchOrderStatusRepo({ match, status: newStatus })
	if (patchedOrder) {
		notify({
			user: purchase.business.owner,
			screen: `/dashboard/${purchase.business.slug}/sales/${patchedOrder._id}`,
			template: { slug: 'purchase_updated_by_customer' },
			media: purchase.customer.media,
			data: { customer: purchase.customer, business: purchase.business }
		})
	}
	return { message: 'purchase status patched successfully', data: patchedOrder }
}

export const appendProductsToOrderSrvc = async ({ orderId, products }) => {
	return appendProductsToOrderRepo({ orderId, products })
}
