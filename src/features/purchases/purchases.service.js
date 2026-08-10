import { errorHandler } from '../../core/error/index.js'
import { log } from '../../core/log/index.js'
import config from '../../config/index.js'
import { findOneOrderRepo, patchOrderStatusRepo, appendProductsToOrderRepo } from './purchases.repository.js'
import { ORDER_STATUSES } from '#orders/orders.constant.js'
import { createdOrderRepo } from '../orders/orders.repository.js'
import { notify } from '#core/notifications/index.js'

export const findOneOrderSrvc = async ({ match, select }) => {
	const fetchedOrder = await findOneOrderRepo({ match, select })
	return fetchedOrder
}

export const createPurchaseSrvc = async ({ customer, business, products, status, price }) => {
	log({ level: 'debug', message: 'createPurchaseSrvc', data: { customer, business, products, status, price } })
	const createdPurchase = await createdOrderRepo({ customer, business, products, status, price })
	if (createdPurchase) {
		notify({ user: business.owner, screen: `/dashboard/${business.slug}/sales/${createdPurchase._id}`, template: { slug: 'purchase_request' }, media: customer.media, data: { customer } })
	}
	return createdPurchase
}

export const processLineTotalSrvc = ({ price, quantity }) => {
	//log({level:'debug',message:'process line total',data:{price,quantity}})
	return { tnd: price.total.tnd * quantity, usd: price.total.usd * quantity || null, eur: price.total.eur * quantity || null }
}

export const patchOrderStatusSrvc = async ({ match, oldStatus, newStatus, purchase }) => {
	if (!validateSaleStatusTransition(oldStatus, newStatus)) {
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

/**
 * Validates a status transition for a purchase.
 * @param {string} oldStatus The current status of the purchase.
 * @param {string} newStatus The new status to transition to.
 * @returns {boolean} True if the transition is valid, false otherwise.
 */
export function validateSaleStatusTransition(oldStatus, newStatus) {
	const allowedTransitions = {
		[ORDER_STATUSES.PENDING_BUSINESS_CONFIRMATION]: [ORDER_STATUSES.CONFIRMED_BY_BUSINESS, ORDER_STATUSES.CANCELLED_BY_BUSINESS, ORDER_STATUSES.CANCELLED_BY_CUSTOMER],
		[ORDER_STATUSES.CONFIRMED_BY_BUSINESS]: [
			ORDER_STATUSES.READY_FOR_PICKUP_BY_CUSTOMER,
			ORDER_STATUSES.DELIVERING_TO_CUSTOMER,
			ORDER_STATUSES.CANCELLED_BY_BUSINESS,
			ORDER_STATUSES.CANCELLED_BY_CUSTOMER // <--- Added this line
		],
		[ORDER_STATUSES.READY_FOR_PICKUP_BY_CUSTOMER]: [
			ORDER_STATUSES.RECEIVED_BY_CUSTOMER,
			ORDER_STATUSES.RESERVATION_EXPIRED,
			ORDER_STATUSES.CANCELLED_BY_CUSTOMER // Often allowed if they haven't picked it up yet
		],
		[ORDER_STATUSES.DELIVERING_TO_CUSTOMER]: [ORDER_STATUSES.DELIVERED_TO_CUSTOMER, ORDER_STATUSES.CANCELLED_BY_BUSINESS],
		[ORDER_STATUSES.DELIVERED_TO_CUSTOMER]: [ORDER_STATUSES.RECEIVED_BY_CUSTOMER],
		[ORDER_STATUSES.RECEIVED_BY_CUSTOMER]: [],
		[ORDER_STATUSES.RESERVATION_EXPIRED]: [],
		[ORDER_STATUSES.CANCELLED_BY_CUSTOMER]: [],
		[ORDER_STATUSES.CANCELLED_BY_BUSINESS]: []
	}

	const validNextSteps = allowedTransitions[oldStatus]

	if (!validNextSteps) {
		return false
	}

	return validNextSteps.includes(newStatus)
}
